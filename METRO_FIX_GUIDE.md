# Metro Bundler Registration Fix

## Error
```
ERROR Invariant Violation: "reactnative" has not been registered. This can happen if:
* Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
* A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called.
```

## Root Cause
This error occurs when Metro bundler has cached old/corrupted module information after file modifications. The app registration is correct, but Metro needs to be restarted with a clean cache.

## Quick Fix Steps

### Option 1: Manual Steps
1. **Stop Metro bundler** (Ctrl+C in the terminal running Metro)
2. **Clear Metro cache:**
   ```bash
   npx react-native start --reset-cache
   ```
3. **In a new terminal, run the app:**
   ```bash
   npx react-native run-android
   ```

### Option 2: Use the Fix Script
Run the provided batch file:
```bash
fix-metro-restart.bat
```

### Option 3: Complete Clean Restart
If the above doesn't work:
```bash
# Stop all Node processes
taskkill /f /im node.exe

# Clear all caches
npx react-native start --reset-cache --port 8081

# In new terminal
npx react-native run-android
```

## Why This Happens
- File modifications can cause Metro to cache inconsistent module states
- The `AppRegistry.registerComponent` call is correct in `index.js`
- The app name "reactnative" matches `app.json`
- Metro just needs a fresh start to recognize the changes

## Prevention
- Always restart Metro after significant file changes
- Use `--reset-cache` flag when in doubt
- Keep Metro terminal separate from build terminal

## Verification
After restart, you should see:
```
✅ Metro bundler started successfully
✅ App registered as "reactnative"
✅ Certificate fixes working properly
```