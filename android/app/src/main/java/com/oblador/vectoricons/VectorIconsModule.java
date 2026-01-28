package com.oblador.vectoricons;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class VectorIconsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public VectorIconsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNVectorIcons";
    }

    @ReactMethod
    public void getImageForFont(String fontFamily, String glyph, float fontSize, String color, Promise promise) {
        // Simple implementation that just resolves
        promise.resolve(null);
    }
}