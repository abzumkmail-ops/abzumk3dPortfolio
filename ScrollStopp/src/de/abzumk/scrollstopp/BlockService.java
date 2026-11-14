package de.abzumk.scrollstopp;

import android.accessibilityservice.AccessibilityService;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Toast;
import java.util.List;

public class BlockService extends AccessibilityService {
    private static final String SNAP = "com.snapchat.android";
    private static final String YT = "com.google.android.youtube";

    // YouTube Shorts player view ids
    private static final String[] SHORTS_IDS = {
            "reel_recycler", "reel_player_page_container", "reel_watch_player",
            "reel_watch_fragment_root", "shorts_player_container"
    };
    // Snapchat headers (EN + DE)
    private static final String[] STORY_WORDS = {"stories", "storys", "story", "discover", "entdecken"};
    private static final String[] SPOT_WORDS = {"spotlight"};
    private static final String[] CHAT_WORDS = {"chat", "chats"};

    private final Handler handler = new Handler(Looper.getMainLooper());
    private long lastAction = 0;
    private boolean pending = false;
    private String pendingPkg;

    private final Runnable check = () -> {
        pending = false;
        try { inspect(pendingPkg); } catch (Exception ignored) { }
    };

    @Override
    public void onAccessibilityEvent(AccessibilityEvent e) {
        if (e == null || e.getPackageName() == null) return;
        pendingPkg = e.getPackageName().toString();
        if (!pending) {
            pending = true;
            handler.postDelayed(check, 120);
        }
    }

    private void inspect(String pkg) {
        if (SystemClock.uptimeMillis() - lastAction < 900) return;
        AccessibilityNodeInfo root = getRootInActiveWindow();
        if (root == null || root.getPackageName() == null) return;
        String rootPkg = root.getPackageName().toString();

        if (YT.equals(rootPkg) && Prefs.on(this, Prefs.SHORTS)) {
            for (String id : SHORTS_IDS) {
                List<AccessibilityNodeInfo> l = root.findAccessibilityNodeInfosByViewId(YT + ":id/" + id);
                for (AccessibilityNodeInfo n : l) {
                    if (n.isVisibleToUser()) { block("YouTube Shorts blockiert", null); return; }
                }
            }
        } else if (SNAP.equals(rootPkg)) {
            boolean stories = Prefs.on(this, Prefs.STORIES);
            boolean spot = Prefs.on(this, Prefs.SPOTLIGHT);
            if (!stories && !spot) return;
            int h = getResources().getDisplayMetrics().heightPixels;
            Found f = new Found();
            walk(root, h, f, 0);
            if ((stories && f.storyHeader) || (spot && f.spotHeader)) {
                block(f.spotHeader ? "Spotlight blockiert" : "Storys blockiert", f.chatTab);
            }
        }
    }

    private static final class Found {
        boolean storyHeader, spotHeader;
        AccessibilityNodeInfo chatTab;
    }

    private void walk(AccessibilityNodeInfo n, int h, Found f, int depth) {
        if (n == null || depth > 40) return;
        if (n.isVisibleToUser()) {
            String label = label(n);
            if (label != null) {
                Rect r = new Rect();
                n.getBoundsInScreen(r);
                boolean top = r.top >= 0 && r.bottom < h * 0.16;
                boolean bottom = r.top > h * 0.8;
                if (top && matches(label, STORY_WORDS)) f.storyHeader = true;
                if (top && matches(label, SPOT_WORDS)) f.spotHeader = true;
                if (bottom && f.chatTab == null && matches(label, CHAT_WORDS)) f.chatTab = n;
            }
        }
        for (int i = 0; i < n.getChildCount(); i++) walk(n.getChild(i), h, f, depth + 1);
    }

    private static String label(AccessibilityNodeInfo n) {
        CharSequence t = n.getText();
        if (t == null || t.length() == 0) t = n.getContentDescription();
        if (t == null || t.length() == 0 || t.length() > 20) return null;
        return t.toString().trim().toLowerCase();
    }

    private static boolean matches(String s, String[] words) {
        for (String w : words) if (s.equals(w)) return true;
        return false;
    }

    private void block(String msg, AccessibilityNodeInfo chatTab) {
        lastAction = SystemClock.uptimeMillis();
        boolean done = false;
        AccessibilityNodeInfo n = chatTab;
        while (n != null && !done) {
            if (n.isClickable()) done = n.performAction(AccessibilityNodeInfo.ACTION_CLICK);
            n = n.getParent();
        }
        if (!done) performGlobalAction(GLOBAL_ACTION_BACK);
        Prefs.countBlock(this);
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

    @Override public void onInterrupt() { }
}
