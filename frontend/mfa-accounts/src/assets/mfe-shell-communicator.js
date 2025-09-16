/**
 * Utilidades para comunicación MFE <-> Shell
 * Copiar este archivo en cada Micro Frontend para facilitar la integración
 */

// Tipos de mensajes soportados
const MESSAGE_TYPES = {
  AUTH_DATA: 'AUTH_DATA',
  SESSION_UPDATE: 'SESSION_UPDATE',
  READY: 'READY',
  REQUEST_AUTH: 'REQUEST_AUTH',
  NAVIGATION: 'NAVIGATION',
  ERROR: 'ERROR'
};

// Configuración de orígenes por entorno
const SHELL_ORIGINS = {
  development: 'http://localhost:4200',
  staging: 'https://shell-staging.banco.com',
  production: 'https://shell.banco.com'
};

class MFEShellCommunicator {
  constructor(mfeId, environment = 'development') {
    this.mfeId = mfeId;
    this.shellOrigin = SHELL_ORIGINS[environment];
    this.authData = null;
    this.listeners = new Map();
    
    this.init();
  }
  
  init() {
    // Configurar listener de mensajes
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Cargar datos iniciales del storage
    this.loadAuthFromStorage();
    
    // Notificar al Shell que el MFE está listo
    setTimeout(() => {
      this.sendToShell(MESSAGE_TYPES.READY, { 
        mfeId: this.mfeId,
        timestamp: Date.now()
      });
    }, 100);
  }
  
  handleMessage(event) {
    // Validar origen por seguridad
    if (event.origin !== this.shellOrigin) {
      console.warn('Mensaje de origen no confiable:', event.origin);
      return;
    }
    
    const message = event.data;
    
    switch (message.type) {
      case MESSAGE_TYPES.AUTH_DATA:
        this.handleAuthData(message.payload);
        break;
        
      case MESSAGE_TYPES.SESSION_UPDATE:
        this.handleSessionUpdate(message.payload);
        break;
        
      default:
        console.log('Tipo de mensaje no manejado:', message.type);
    }
    
    // Notificar a listeners registrados
    if (this.listeners.has(message.type)) {
      this.listeners.get(message.type).forEach(callback => {
        try {
          callback(message.payload);
        } catch (error) {
          console.error('Error en listener:', error);
        }
      });
    }
  }
  
  handleAuthData(authData) {
    this.authData = authData;
    this.saveAuthToStorage(authData);
    console.log('Datos de autenticación actualizados:', authData);
  }
  
  handleSessionUpdate(authData) {
    this.authData = authData;
    this.saveAuthToStorage(authData);
    console.log('Sesión actualizada:', authData);
  }
  
  loadAuthFromStorage() {
    try {
      // Intentar múltiples fuentes de datos de autenticación
      const sources = [
        'authentication',
        'auth_token',
        'bp_auth_token'
      ];
      
      for (const source of sources) {
        const data = sessionStorage.getItem(source);
        if (data) {
          if (source === 'authentication') {
            this.authData = JSON.parse(data);
          } else {
            // Para tokens individuales, crear objeto de auth básico
            this.authData = {
              token: data,
              isAuthenticated: true
            };
            
            // Intentar obtener datos de usuario también
            const userData = sessionStorage.getItem('user_data');
            if (userData) {
              this.authData.user = JSON.parse(userData);
            }
          }
          break;
        }
      }
      
      if (this.authData) {
        console.log('Datos de autenticación cargados desde storage');
      }
    } catch (error) {
      console.error('Error cargando autenticación desde storage:', error);
    }
  }
  
  saveAuthToStorage(authData) {
    try {
      sessionStorage.setItem(`${this.mfeId}_auth`, JSON.stringify(authData));
    } catch (error) {
      console.error('Error guardando datos de auth:', error);
    }
  }
  
  sendToShell(type, payload) {
    const message = {
      type,
      payload,
      source: this.mfeId,
      target: 'shell',
      timestamp: Date.now()
    };
    
    try {
      window.parent.postMessage(message, this.shellOrigin);
    } catch (error) {
      console.error('Error enviando mensaje al Shell:', error);
    }
  }
  
  // Métodos públicos para usar en el MFE
  
  getToken() {
    return this.authData?.token || sessionStorage.getItem('auth_token');
  }
  
  getUser() {
    return this.authData?.user || JSON.parse(sessionStorage.getItem('user_data') || 'null');
  }
  
  isAuthenticated() {
    return this.authData?.isAuthenticated || !!this.getToken();
  }
  
  requestAuthData() {
    this.sendToShell(MESSAGE_TYPES.REQUEST_AUTH, {});
  }
  
  reportError(error, context = {}) {
    this.sendToShell(MESSAGE_TYPES.ERROR, {
      message: error.message || error,
      stack: error.stack,
      context,
      mfeId: this.mfeId,
      url: window.location.href
    });
  }
  
  requestNavigation(route, params = {}) {
    this.sendToShell(MESSAGE_TYPES.NAVIGATION, {
      action: 'navigate',
      route,
      params
    });
  }
  
  // Registrar listeners para eventos específicos
  onAuthData(callback) {
    this.addListener(MESSAGE_TYPES.AUTH_DATA, callback);
  }
  
  onSessionUpdate(callback) {
    this.addListener(MESSAGE_TYPES.SESSION_UPDATE, callback);
  }
  
  addListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }
  
  removeListener(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  // Método para debugging
  enableDebugMode() {
    this.debugMode = true;
    
    window.addEventListener('message', (event) => {
      if (this.debugMode) {
        console.log('🔄 MFE Message Debug:', {
          origin: event.origin,
          expected: this.shellOrigin,
          data: event.data,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
}

// Función helper para crear configuración de HTTP con token
function createAuthHeaders(communicator) {
  const token = communicator.getToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}

// Helper para Axios
function setupAxiosInterceptor(communicator) {
  if (typeof axios !== 'undefined') {
    axios.interceptors.request.use(config => {
      const token = communicator.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
}

// Helper para fetch
function createAuthenticatedFetch(communicator) {
  return function(url, options = {}) {
    const headers = {
      ...createAuthHeaders(communicator),
      ...(options.headers || {})
    };
    
    return fetch(url, {
      ...options,
      headers
    });
  };
}

// Exportar para diferentes tipos de módulos
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    MFEShellCommunicator,
    MESSAGE_TYPES,
    createAuthHeaders,
    setupAxiosInterceptor,
    createAuthenticatedFetch
  };
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return {
      MFEShellCommunicator,
      MESSAGE_TYPES,
      createAuthHeaders,
      setupAxiosInterceptor,
      createAuthenticatedFetch
    };
  });
} else {
  // Global
  window.MFEShellCommunicator = MFEShellCommunicator;
  window.MESSAGE_TYPES = MESSAGE_TYPES;
  window.createAuthHeaders = createAuthHeaders;
  window.setupAxiosInterceptor = setupAxiosInterceptor;
  window.createAuthenticatedFetch = createAuthenticatedFetch;
}

/*
EJEMPLO DE USO EN UN MFE:

// 1. Inicializar comunicador
const shellComm = new MFEShellCommunicator('mfe-clientes', 'development');

// 2. Configurar listeners
shellComm.onAuthData((authData) => {
  console.log('Nueva data de auth recibida:', authData);
  // Actualizar estado de la aplicación
});

// 3. Usar datos de autenticación
if (shellComm.isAuthenticated()) {
  const user = shellComm.getUser();
  const token = shellComm.getToken();
  // Configurar aplicación con datos de usuario
}

// 4. Configurar HTTP client
const authenticatedFetch = createAuthenticatedFetch(shellComm);

// 5. Usar en requests
authenticatedFetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => shellComm.reportError(error, { context: 'data-fetch' }));

// 6. Habilitar debug en desarrollo
if (process.env.NODE_ENV === 'development') {
  shellComm.enableDebugMode();
}
*/
