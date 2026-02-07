package com.reactnative;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends ReactActivity {

  private static final String TAG = "MainActivity";

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "reactnative";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    try {
      return new DefaultReactActivityDelegate(
          this,
          getMainComponentName(),
          // Disable Fabric to prevent crashes
          false);
    } catch (Exception e) {
      Log.e(TAG, "Error creating ReactActivityDelegate", e);
      // Return a basic delegate as fallback
      return new ReactActivityDelegate(this, getMainComponentName());
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    try {
      Log.d(TAG, "MainActivity onCreate started");
      super.onCreate(savedInstanceState);
      Log.d(TAG, "MainActivity onCreate completed successfully");
    } catch (Exception e) {
      Log.e(TAG, "Critical error in MainActivity onCreate", e);
      // Try to handle the error gracefully
      try {
        // Attempt basic initialization
        super.onCreate(null);
      } catch (Exception fallbackError) {
        Log.e(TAG, "Fallback initialization also failed", fallbackError);
        // Last resort - finish the activity
        finish();
      }
    }
  }

  @Override
  protected void onResume() {
    try {
      super.onResume();
      Log.d(TAG, "MainActivity onResume completed");
    } catch (Exception e) {
      Log.e(TAG, "Error in onResume", e);
    }
  }

  @Override
  protected void onPause() {
    try {
      super.onPause();
      Log.d(TAG, "MainActivity onPause completed");
    } catch (Exception e) {
      Log.e(TAG, "Error in onPause", e);
    }
  }
}
