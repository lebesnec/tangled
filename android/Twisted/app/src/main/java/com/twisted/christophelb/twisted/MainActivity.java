package com.twisted.christophelb.twisted;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = (WebView) findViewById(R.id.webView);
        webView.addJavascriptInterface(new JavascriptHandler(), "Android");

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webView.loadUrl("file:///android_asset/webapp/index.html");
    }

    private class JavascriptHandler {
        @JavascriptInterface
        public void reportError(String error) throws Exception {
            throw new Exception(error);
        }
    }
}
