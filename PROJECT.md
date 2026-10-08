# Project: MapleStory v232 Performance Optimization

## Architecture
- Source language: Java (Maven build system, server.bat start script).
- Key server custom components:
  - Custom Drop System (`JayCustomDrop` / related logic)
  - Custom Potential Handler (`JayPotentialHandler` / related logic)
- Performance constraints:
  - High-frequency logging (console and file logs) causes disk/console I/O blocking.
  - Client-side CPU scheduling causes stuttering on Intel 14th Gen hybrid architecture (E-cores vs P-cores).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Locate and Scan Logging Configs | Locate source/config files for JayCustomDrop and JayPotentialHandler, identify log configs. | None | DONE |
| 2 | Mute High-Frequency Logs | Set ENABLE_LOG_GENERAL = false and SHOW_LOG = false in target configurations / files. | M1 | DONE |
| 3 | Verify Build Success | Run `mvn clean compile` to ensure no compile errors are introduced. | M2 | DONE |
| 4 | Client-Side E-Core Resolution Guide | Write Intel 14th Gen core resolution guide (with clear, step-by-step Windows config instructions). | None | DONE |

## Interface Contracts
### Log Configurations
- `ENABLE_LOG_GENERAL` and `SHOW_LOG` must be set to `false`.
- The modifications must not break existing custom features of drop and potential handling.
