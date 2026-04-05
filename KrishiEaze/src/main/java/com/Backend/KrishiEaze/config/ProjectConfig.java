package com.Backend.KrishiEaze.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProjectConfig {
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
