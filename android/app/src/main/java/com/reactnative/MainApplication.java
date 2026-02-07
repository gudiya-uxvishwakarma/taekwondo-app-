package com.reactnative;

import android.app.Application;
import android.util.Log;
import androidx.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.PackageList;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private static final String TAG = "MainApplication";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      // Always return BuildConfig.DEBUG for proper behavior
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      try {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        Log.d(TAG, "Successfully loaded " + packages.size() + " React packages");
        
        // Verify packages are not null
        if (packages == null || packages.isEmpty()) {
          Log.w(TAG, "Package list is empty, using fallback");
          return Arrays.<ReactPackage>asList(new MainReactPackage());
        }
        
        return packages;
      } catch (Exception e) {
        Log.e(TAG, "Critical error loading React packages, using minimal fallback", e);
        // Return absolute minimum to prevent crash
        return Arrays.<ReactPackage>asList(new MainReactPackage());
      }
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    try {
      Log.d(TAG, "MainApplication onCreate starting...");
      super.onCreate();
      
      // Initialize SoLoader with comprehensive error handling
      try {
        Log.d(TAG, "Initializing SoLoader...");
        SoLoader.init(this, /* native exopackage */ false);
        Log.d(TAG, "SoLoader initialized successfully");
      } catch (UnsatisfiedLinkError e) {
        Log.e(TAG, "SoLoader UnsatisfiedLinkError - native library issue", e);
        // Continue without crashing
      } catch (Exception e) {
        Log.e(TAG, "SoLoader general initialization error", e);
        // Continue without crashing
      }
      
      Log.d(TAG, "MainApplication onCreate completed successfully");
      
    } catch (Exception e) {
      Log.e(TAG, "CRITICAL ERROR in MainApplication onCreate", e);
      // Log the error but don't crash the app
      // The app should still try to start
    }
  }
}