package com.pichincha.deposit.account.infrastructure.input.adapter.rest.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqProperties {

  public static String EXCHANGE;
  public static String ROUTING_KEY;

  @Value("${spring.rabbitmq.template.exchange}")
  public void setExchange(String exchange) {
    RabbitMqProperties.EXCHANGE = exchange;
  }

  @Value("${spring.rabbitmq.template.routing-key}")
  public void setRoutingKey(String routingKey) {
    RabbitMqProperties.ROUTING_KEY = routingKey;
  }

}
