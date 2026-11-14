package de.abzumk.scrollstopp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.admin.DevicePolicyManager;
import java.text.DateFormat;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
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
    private Button permBtn, protectBtn, cancelBtn;
    private TextView protectText;
    private final List<Switch> switches = new ArrayList<>();

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

        TextView ph = new TextView(this);
        ph.setText("Schutz vor Deinstallieren");
        ph.setTextSize(20);
        ph.setTypeface(Typeface.DEFAULT_BOLD);
        ph.setPadding(0, dp(28), 0, dp(6));
        col.addView(ph);

        protectText = new TextView(this);
        protectText.setTextSize(14);
        col.addView(protectText);

        protectBtn = new Button(this);
        protectBtn.setOnClickListener(v -> onProtectClick());
        col.addView(protectBtn, lp(dp(10)));

        cancelBtn = new Button(this);
        cancelBtn.setText("Doch nicht – Schutz behalten");
        cancelBtn.setOnClickListener(v -> { Protection.cancelUnlock(this); refresh(); });
        col.addView(cancelBtn, lp(dp(6)));

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
        s.setOnCheckedChangeListener((v, on) -> {
            Prefs.get(this).edit().putBoolean(key, on).apply();
            if (protectText != null) refresh();
        });
        switches.add(s);
        col.addView(s);
    }

    private void onProtectClick() {
        if (!Protection.active(this)) {
            if (!serviceOn()) {
                startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));
                return;
            }
            new AlertDialog.Builder(this)
                    .setTitle("Wie lange soll das Aufheben dauern?")
                    .setItems(Protection.DELAY_NAMES, (d, which) -> new AlertDialog.Builder(this)
                            .setTitle("Schutz aktivieren?")
                            .setMessage("Danach kannst du ScrollStopp nicht mehr einfach löschen oder ausschalten. "
                                    + "Zum Aufheben musst du in der App \"Schutz aufheben\" tippen und dann "
                                    + Protection.DELAY_NAMES[which] + " warten.\n\nIm nächsten Schritt bitte \"Aktivieren\" tippen.")
                            .setPositiveButton("Aktivieren", (d2, w2) -> {
                                Protection.enable(this, Protection.DELAYS[which]);
                                requestAdmin();
                                refresh();
                            })
                            .setNegativeButton("Abbrechen", null)
                            .show())
                    .show();
        } else if (!Protection.adminActive(this)) {
            requestAdmin();
        } else if (Protection.unlockAt(this) == 0) {
            new AlertDialog.Builder(this)
                    .setTitle("Schutz aufheben?")
                    .setMessage("Der Schutz endet erst in " + Protection.delayName(Protection.delay(this))
                            + ". Bis dahin bleibt alles blockiert.")
                    .setPositiveButton("Timer starten", (d, w) -> { Protection.requestUnlock(this); refresh(); })
                    .setNegativeButton("Abbrechen", null)
                    .show();
        }
    }

    private void requestAdmin() {
        Intent i = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        i.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, Protection.admin(this));
        i.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Damit ScrollStopp nicht einfach gelöscht werden kann.");
        startActivity(i);
    }

    private void refresh() {
        boolean prot = Protection.active(this);
        long at = Protection.unlockAt(this);
        for (Switch s : switches) {
            // While protected, blockers can only be switched on, never off.
            s.setEnabled(!prot || !s.isChecked());
        }
        cancelBtn.setVisibility(prot && at > 0 ? android.view.View.VISIBLE : android.view.View.GONE);
        if (!prot) {
            protectText.setText("Aus. Wenn an, kann ScrollStopp nicht einfach gelöscht oder ausgeschaltet werden.");
            protectBtn.setText("Schutz aktivieren");
            protectBtn.setEnabled(true);
        } else if (!Protection.adminActive(this)) {
            protectText.setText("Fast fertig: Geräteadministrator noch nicht aktiv.");
            protectBtn.setText("Geräteadministrator aktivieren");
            protectBtn.setEnabled(true);
        } else if (at > 0) {
            protectText.setText("🔒 Aktiv. Schutz endet am "
                    + DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT).format(new Date(at)) + ".");
            protectBtn.setText("Timer läuft …");
            protectBtn.setEnabled(false);
        } else {
            protectText.setText("🔒 Aktiv. Aufheben dauert " + Protection.delayName(Protection.delay(this)) + ".");
            protectBtn.setText("Schutz aufheben");
            protectBtn.setEnabled(true);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        refresh();
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
