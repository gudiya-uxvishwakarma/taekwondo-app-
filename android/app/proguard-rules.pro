# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep Vector Icons - CRITICAL FOR RELEASE BUILD
-keep class com.oblador.vectoricons.** { *; }
-keep class com.oblador.vectoricons.VectorIconsPackage { *; }
-keep class com.oblador.vectoricons.VectorIconsModule { *; }

# Keep application classes
-keep class com.reactnative.** { *; }

# Keep asset-related classes - CRITICAL FOR IMAGES AND LOGOS
-keep class com.facebook.react.views.image.** { *; }
-keep class com.facebook.react.modules.network.** { *; }
-keep class com.facebook.react.bridge.ReadableNativeMap { *; }
-keep class com.facebook.react.bridge.WritableNativeMap { *; }
-keep class com.facebook.react.bridge.ReadableNativeArray { *; }
-keep class com.facebook.react.bridge.WritableNativeArray { *; }

# Keep image loading classes
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.drawee.** { *; }

# Don't obfuscate asset paths
-keepnames class * extends com.facebook.react.bridge.ReactPackage
-keepnames class * extends com.facebook.react.bridge.NativeModule
-keepnames class * extends com.facebook.react.bridge.JavaScriptModule

# Keep JSON parsing
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep crypto-js classes
-keep class com.reactnative.crypto.** { *; }

# Keep random values
-keep class org.linusu.** { *; }

# Keep axios and network classes
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Don't warn about missing classes
-dontwarn com.facebook.react.**
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep all enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Additional rules to prevent crashes
-keep class * extends java.lang.Exception
-keep class * extends java.lang.Error

# Keep React Native bridge methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.bridge.ReactProp <methods>;
    @com.facebook.react.bridge.ReactPropGroup <methods>;
}

# Keep React Native modules
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# Keep React Native view managers
-keep class * extends com.facebook.react.uimanager.ViewManager { *; }
-keep class * extends com.facebook.react.uimanager.SimpleViewManager { *; }

# Keep React Native TurboModules
-keep class * extends com.facebook.react.turbomodule.core.interfaces.TurboModule { *; }

# Keep all resources - CRITICAL FOR ASSETS
-keepclassmembers class **.R$* {
    public static <fields>;
}
-keep class **.R$*

# Keep font files and assets
-keep class * { *; }
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*

# Prevent crashes from missing classes
-dontnote **
-ignorewarnings