import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { MfeService, MFEConfig } from '../../services/mfe.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockMfeService: jest.Mocked<MfeService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSanitizer: jest.Mocked<DomSanitizer>;

  const mockUser = {
    id: '1',
    username: 'admin',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin']
  };

  const mockMFEConfigs: MFEConfig[] = [
    {
      id: 'clientes',
      name: 'Gestión de Clientes',
      url: 'mock://localhost:4201/mfa-customers/list',
      icon: 'people',
      description: 'Gestione la información de sus clientes'
    },
    {
      id: 'cuentas',
      name: 'Administración de Cuentas',
      url: 'mock://localhost:4202/mfa-accounts/list',
      icon: 'account_balance',
      description: 'Administre sus cuentas bancarias'
    }
  ];

  beforeEach(async () => {
    mockAuthService = {
      getUser: jest.fn().mockReturnValue(of(mockUser)),
      getToken: jest.fn().mockReturnValue('mock-token'),
      getCurrentAuthState: jest.fn().mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        token: 'mock-token'
      }),
      logout: jest.fn()
    } as any;

    mockMfeService = {
      getMFEConfigs: jest.fn().mockReturnValue(mockMFEConfigs),
      currentMFE: of(null),
      loadMFE: jest.fn().mockReturnValue(of(mockMFEConfigs[0])),
      closeMFE: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockSanitizer = {
      bypassSecurityTrustResourceUrl: jest.fn().mockImplementation(url => url)
    } as any;

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MfeService, useValue: mockMfeService },
        { provide: Router, useValue: mockRouter },
        { provide: DomSanitizer, useValue: mockSanitizer }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sidebar collapsed by default', () => {
    expect(component.sidebarCollapsed).toBe(true);
  });

  it('should toggle sidebar state', () => {
    expect(component.sidebarCollapsed).toBe(true);
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBe(false);
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBe(true);
  });

  it('should load user data on init', () => {
    expect(component.user).toEqual(mockUser);
    expect(mockAuthService.getUser).toHaveBeenCalled();
  });

  it('should load MFE configurations on init', () => {
    expect(component.menuItems).toEqual(mockMFEConfigs);
    expect(mockMfeService.getMFEConfigs).toHaveBeenCalled();
  });

  it('should load MFE when menu item is clicked', () => {
    const clientesItem = mockMFEConfigs[0];
    
    component.onMenuItemClick(clientesItem);
    
    expect(mockMfeService.loadMFE).toHaveBeenCalledWith('clientes');
  });

  it('should close MFE when close button is clicked', () => {
    component.onCloseMFE();
    expect(mockMfeService.closeMFE).toHaveBeenCalled();
  });

  it('should call logout when logout button is clicked', () => {
    component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should return correct user display name', () => {
    expect(component.getUserDisplayName()).toBe('Admin User');
  });

  it('should return correct user initials', () => {
    expect(component.getUserInitials()).toBe('AU');
  });

  it('should handle user with no names', () => {
    component.user = {
      id: '1',
      username: 'test',
      email: 'test@test.com',
      firstName: '',
      lastName: '',
      roles: ['user']
    };
    
    expect(component.getUserDisplayName()).toBe('Usuario');
    expect(component.getUserInitials()).toBe('U');
  });

  it('should check if menu item is active', () => {
    component.currentMFE = mockMFEConfigs[0];
    
    expect(component.isMenuItemActive(mockMFEConfigs[0])).toBe(true);
    expect(component.isMenuItemActive(mockMFEConfigs[1])).toBe(false);
  });

  describe('Sidebar Functionality', () => {
    it('should toggle sidebar and trigger change detection', () => {
      const changeDetectionSpy = jest.spyOn(component['cdr'], 'detectChanges');
      
      component.toggleSidebar();
      
      expect(component.sidebarCollapsed).toBe(true);
      expect(changeDetectionSpy).toHaveBeenCalled();
    });

    it('should render sidebar toggle button', () => {
      const compiled = fixture.nativeElement;
      const toggleButton = compiled.querySelector('.sidebar-toggle');
      
      expect(toggleButton).toBeTruthy();
    });

    it('should apply collapsed class when sidebar is collapsed', () => {
      component.sidebarCollapsed = true;
      fixture.detectChanges();
      
      const sidebar = fixture.nativeElement.querySelector('.dashboard-sidebar');
      expect(sidebar.classList.contains('sidebar--collapsed')).toBe(true);
    });

    it('should show arrow right when collapsed and arrow left when expanded', () => {
      const compiled = fixture.nativeElement;
      
      // Initially collapsed (default state)
      fixture.detectChanges();
      let toggleIcon = compiled.querySelector('.toggle-icon');
      expect(toggleIcon.textContent).toBe('→');
      
      // After expanding
      component.sidebarCollapsed = false;
      fixture.detectChanges();
      toggleIcon = compiled.querySelector('.toggle-icon');
      expect(toggleIcon.textContent).toBe('←');
    });
  });
});
