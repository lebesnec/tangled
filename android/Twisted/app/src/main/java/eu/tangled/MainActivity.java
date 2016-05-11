package eu.tangled;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = (WebView) findViewById(R.id.webView);
        webView.addJavascriptInterface(new JavascriptHandler(), "Android");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }
//            @Override
//            public void onPageFinished(WebView view, String url) {
//                if (url.startsWith("https://www.facebook.com/connect/connect_to_external_page_widget_loggedin.php")){
//                    String redirectUrl = getFacebookLikeUrl();
//                    view.loadUrl(redirectUrl);
//                    return;
//                }
//                super.onPageFinished(view, url);
//            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
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
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.loadUrl("file:///android_asset/webapp/index.html");
    }

    private class JavascriptHandler {
        @JavascriptInterface
        public void reportError(String error) throws Exception {
            throw new Exception(error);
        }
    }

}
