package com.twisted.christophelb.twisted;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    private String error = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = (WebView) findViewById(R.id.webView);
        webView.setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage cm) {
                // report JS error to Android :
                if (cm.messageLevel() == ConsoleMessage.MessageLevel.ERROR) {
                    throw new RuntimeException(cm.message());
                }
                return true;
            }
        });

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        webView.loadUrl("file:///android_asset/webapp/index.html");
    }
}
