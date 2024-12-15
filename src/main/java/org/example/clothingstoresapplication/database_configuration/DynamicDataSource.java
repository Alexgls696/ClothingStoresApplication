package org.example.clothingstoresapplication.database_configuration;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class DynamicDataSource extends AbstractRoutingDataSource {

    private static final ThreadLocal<String>CONTEXT = new ThreadLocal<>();

    public DynamicDataSource() {

    }

    public static void setCurrentDataSource(String key) {
        CONTEXT.set(key);
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return CONTEXT.get();
    }
}
