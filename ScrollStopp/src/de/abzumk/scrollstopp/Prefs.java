package de.abzumk.scrollstopp;

import android.content.Context;
import android.content.SharedPreferences;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

final class Prefs {
    static final String STORIES = "block_stories";
    static final String SPOTLIGHT = "block_spotlight";
    static final String SHORTS = "block_shorts";

    static SharedPreferences get(Context c) {
        return c.getSharedPreferences("scrollstopp", Context.MODE_PRIVATE);
    }

    static boolean on(Context c, String key) {
        return get(c).getBoolean(key, true);
    }

    private static String today() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    static void countBlock(Context c) {
        SharedPreferences p = get(c);
        String d = today();
        int n = d.equals(p.getString("day", "")) ? p.getInt("count", 0) : 0;
        p.edit().putString("day", d).putInt("count", n + 1).putInt("total", p.getInt("total", 0) + 1).apply();
    }

    static int todayCount(Context c) {
        SharedPreferences p = get(c);
        return today().equals(p.getString("day", "")) ? p.getInt("count", 0) : 0;
    }

    static int total(Context c) {
        return get(c).getInt("total", 0);
    }
}
