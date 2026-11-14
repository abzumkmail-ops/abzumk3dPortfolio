package de.abzumk.scrollstopp;

import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;

public class AdminReceiver extends DeviceAdminReceiver {
    @Override
    public CharSequence onDisableRequested(Context c, Intent i) {
        return "Wenn du das ausschaltest, kann ScrollStopp gelöscht werden. Nutze lieber \"Schutz aufheben\" in der App.";
    }
}
