package com.example;

import android.app.Application;
import android.os.Build;
import android.webkit.WebView;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ExampleApplication extends Application implements ReactApplication {
    private final ReactNativeHost mHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return true;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mHost;
    }
}
