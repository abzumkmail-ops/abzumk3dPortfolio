package de.abzumk.scrollstopp;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;

public class MainActivity extends Activity {
    private TextView status, stats;
    private Button permBtn;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        int pad = dp(20);
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(pad, dp(36), pad, pad);

        TextView title = new TextView(this);
        title.setText("ScrollStopp");
        title.setTextSize(30);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        col.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Kein Endlos-Scrollen mehr. Chats & Snaps bleiben.");
        sub.setTextSize(15);
        sub.setPadding(0, dp(4), 0, dp(20));
        col.addView(sub);

        status = new TextView(this);
        status.setTextSize(17);
        status.setTypeface(Typeface.DEFAULT_BOLD);
        status.setPadding(dp(16), dp(14), dp(16), dp(14));
        col.addView(status);

        permBtn = new Button(this);
        permBtn.setText("Berechtigung geben");
        permBtn.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)));
        col.addView(permBtn, lp(dp(10)));

        addSwitch(col, "Snapchat Storys blockieren", Prefs.STORIES);
        addSwitch(col, "Snapchat Spotlight blockieren", Prefs.SPOTLIGHT);
        addSwitch(col, "YouTube Shorts blockieren", Prefs.SHORTS);

        stats = new TextView(this);
        stats.setTextSize(15);
        stats.setPadding(0, dp(22), 0, dp(22));
        col.addView(stats);

        TextView help = new TextView(this);
        help.setTextSize(13);
        help.setAlpha(0.75f);
        help.setText("So geht's:\n"
                + "1. \"Berechtigung geben\" tippen → \"Installierte Apps\" → ScrollStopp → einschalten.\n\n"
                + "Ist der Schalter grau / \"Eingeschränkte Einstellung\"? Dann:\n"
                + "2. Unten \"App-Info öffnen\" tippen → oben rechts ⋮ → \"Eingeschränkte Einstellungen zulassen\".\n"
                + "3. Danach Schritt 1 wiederholen.\n\n"
                + "Die App sendet nichts ins Internet und schaut nur in Snapchat und YouTube.");
        col.addView(help);

        Button info = new Button(this);
        info.setText("App-Info öffnen");
        info.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:" + getPackageName()))));
        col.addView(info, lp(dp(12)));

        ScrollView sv = new ScrollView(this);
        sv.addView(col);
        setContentView(sv);
    }

    private void addSwitch(LinearLayout col, String text, String key) {
        Switch s = new Switch(this);
        s.setText(text);
        s.setTextSize(17);
        s.setPadding(0, dp(14), 0, dp(14));
        s.setChecked(Prefs.on(this, key));
        s.setOnCheckedChangeListener((v, on) -> Prefs.get(this).edit().putBoolean(key, on).apply());
        col.addView(s);
    }

    @Override
    protected void onResume() {
        super.onResume();
        boolean on = serviceOn();
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dp(12));
        bg.setColor(on ? Color.parseColor("#2E7D32") : Color.parseColor("#C62828"));
        status.setBackground(bg);
        status.setTextColor(Color.WHITE);
        status.setText(on ? "✓ Aktiv – Blocker läuft" : "✗ Aus – bitte Berechtigung geben");
        permBtn.setText(on ? "Bedienungshilfen-Einstellungen" : "Berechtigung geben");
        stats.setText("Heute blockiert: " + Prefs.todayCount(this) + "×   ·   Insgesamt: " + Prefs.total(this) + "×");
    }

    private boolean serviceOn() {
        String s = Settings.Secure.getString(getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
        return s != null && s.contains(getPackageName() + "/");
    }

    private LinearLayout.LayoutParams lp(int top) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2);
        p.topMargin = top;
        p.gravity = Gravity.CENTER_HORIZONTAL;
        return p;
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }
}
