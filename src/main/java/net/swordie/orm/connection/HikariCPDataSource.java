package net.swordie.orm.connection;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import net.swordie.ms.ServerConstants;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class HikariCPDataSource {

    private static final Logger log = LogManager.getLogger(HikariCPDataSource.class);

    private static String host = "127.0.0.1";
    private static int port = 3306;
    private static String dbName = "swordie232";
    private static String username = "root";
    private static String password = "root";

    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    public static void init() {
        loadProperties();
        String url = String.format("jdbc:mysql://%s:%d/%s?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC", host, port, dbName);
        log.info(String.format("Initializing HikariCP Database Connection: %s:%d/%s (User: %s)", host, port, dbName, username));

        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setLeakDetectionThreshold(1000 * 15);
        config.setMaximumPoolSize(50);
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useSSL", "false");
        config.addDataSourceProperty("allowPublicKeyRetrieval", "true");
        config.addDataSourceProperty("rewriteBatchedStatements", "true");
        config.addDataSourceProperty("autoReconnect", "false");
        config.setAutoCommit(false);
        ds = new HikariDataSource(config);
    }

    private static void loadProperties() {
        File propFile = new File(ServerConstants.RESOURCES_DIR, "db.properties");
        if (propFile.exists()) {
            Properties prop = new Properties();
            try (InputStream input = new FileInputStream(propFile)) {
                prop.load(input);
                host = prop.getProperty("db.host", host).trim();
                try {
                    port = Integer.parseInt(prop.getProperty("db.port", String.valueOf(port)).trim());
                } catch (NumberFormatException ignored) {}
                dbName = prop.getProperty("db.name", dbName).trim();
                username = prop.getProperty("db.user", username).trim();
                password = prop.getProperty("db.password", password);
                if (password != null) {
                    password = password.trim();
                } else {
                    password = "";
                }
                log.info(String.format("Loaded database config from %s", propFile.getAbsolutePath()));
            } catch (IOException e) {
                log.warn("Could not read db.properties, using defaults.", e);
            }
        }
    }

    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }

    private HikariCPDataSource() {
    }
}
