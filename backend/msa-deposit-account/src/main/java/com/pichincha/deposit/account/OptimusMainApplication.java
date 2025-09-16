 package com.pichincha.deposit.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * Arquitectura tradicional para el recurso msa-deposit-account extendiendo
 * de la interfaz generada.
<br/>
 * <b>Class</b>: PichinchaOptimusMainApplication<br/>
 * <b>Copyright</b>: &copy; 2025 Banco Pichincha<br/>
 *
 * @author Banco Pichincha <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
*
<li>Marco Puenayan</li>
*
</ul>
 * <u>Changes</u>:<br/>
 * <ul>
*
<li>Jun 16, 2025 Creaci&oacute;n de Clase.</li>
*
</ul>
 * @version 1.0
 */
@EnableDiscoveryClient
@SpringBootApplication
@ComponentScan(basePackages = {"com.pichincha.deposit.account", "com.pichincha.services", "com.pichincha.common"})
@EnableFeignClients(basePackages = "com.pichincha")
@EnableCaching
public class OptimusMainApplication {

  public static void main(String[] args) {
        SpringApplication.run(OptimusMainApplication.class, args);
    }
}