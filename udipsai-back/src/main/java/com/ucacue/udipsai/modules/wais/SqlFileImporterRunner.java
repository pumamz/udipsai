package com.ucacue.udipsai.modules.wais;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@org.springframework.core.annotation.Order(1)
public class SqlFileImporterRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // System.out.println("=== SQL FILE IMPORTER DISABLED ===");
        // The previous logic here was dangerous as it truncated tables on every
        // startup.
        // It has been disabled to protect production data in Supabase.
    }
}
