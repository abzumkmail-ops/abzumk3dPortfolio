package de.abzumk.scrollstopp;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;

/** Uninstall protection with a delayed, self-service unlock. */
final class Protection {
    static final long[] DELAYS = {60L * 60_000, 24L * 60 * 60_000, 7L * 24 * 60 * 60_000};
    static final String[] DELAY_NAMES = {"1 Stunde", "24 Stunden", "7 Tage"};

    static ComponentName admin(Context c) {
        return new ComponentName(c, AdminReceiver.class);
    }

    static boolean adminActive(Context c) {
        DevicePolicyManager dpm = c.getSystemService(DevicePolicyManager.class);
        return dpm != null && dpm.isAdminActive(admin(c));
    }

    /** Returns whether protection is on; turns it off once a requested unlock has expired. */
    static boolean active(Context c) {
        SharedPreferences p = Prefs.get(c);
        if (!p.getBoolean("protect", false)) return false;
        long at = p.getLong("unlock_at", 0);
        if (at > 0 && System.currentTimeMillis() >= at) {
            p.edit().putBoolean("protect", false).putLong("unlock_at", 0).apply();
            DevicePolicyManager dpm = c.getSystemService(DevicePolicyManager.class);
            if (dpm != null && adminActive(c)) dpm.removeActiveAdmin(admin(c));
            return false;
        }
        return true;
    }

    static void enable(Context c, long delay) {
        Prefs.get(c).edit().putBoolean("protect", true).putLong("delay", delay).putLong("unlock_at", 0).apply();
    }

    static long delay(Context c) {
        return Prefs.get(c).getLong("delay", DELAYS[1]);
    }

    static long unlockAt(Context c) {
        return Prefs.get(c).getLong("unlock_at", 0);
    }

    static void requestUnlock(Context c) {
        Prefs.get(c).edit().putLong("unlock_at", System.currentTimeMillis() + delay(c)).apply();
    }

    static void cancelUnlock(Context c) {
        Prefs.get(c).edit().putLong("unlock_at", 0).apply();
    }

    static String delayName(long d) {
        for (int i = 0; i < DELAYS.length; i++) if (DELAYS[i] == d) return DELAY_NAMES[i];
        return (d / 3_600_000) + " Stunden";
    }
}
