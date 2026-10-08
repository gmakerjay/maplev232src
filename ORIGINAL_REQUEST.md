# Original User Request

## Initial Request — 2026-05-29T04:19:01Z

Analyze and resolve the performance stuttering/lag issue when running the MapleStory v232 emulator (SwordieMS) on client machines, specifically investigating server-side bottlenecks and client-side system compatibility (e.g., Intel 14th Gen hybrid cores).

Working directory: c:\Users\admin\Documents\ServerRun
Integrity mode: development

## Requirements

### R1. Performance Analysis & Stuttering Diagnostic
Investigate the server-side custom systems (specifically JayCustomDrop and JayPotentialHandler) and identify potential performance bottlenecks like synchronous I/O or excessive logging during gameplay.

### R2. Refactoring Abnormal Code
Refactor code causing performance issues, specifically focusing on disabling/muting high-frequency logging or print operations in performance-critical code paths, while keeping custom features working correctly.

### R3. Client-Side E-Core Resolution Guide
Provide a guide to resolve the core scheduling issue on Intel 14th Gen CPUs (stuttering due to execution on E-cores instead of P-cores).

## Acceptance Criteria

### Diagnostics and Optimization
- [ ] Mute high-frequency console/file logs (ENABLE_LOG_GENERAL = false, SHOW_LOG = false) in JayCustomDrop and JayPotentialHandler.
- [ ] Verify that the server compiles and builds successfully using the maven clean compile command.
- [ ] Provide clear, step-by-step instructions to configure Windows/client settings for Intel 14th Gen CPUs to avoid E-core stuttering.
