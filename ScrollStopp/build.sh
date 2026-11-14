#!/usr/bin/env bash
# Builds ScrollStopp.apk without Gradle. Usage: ANDROID_HOME=/path/to/sdk ./build.sh
set -euo pipefail
cd "$(dirname "$0")"
BT="$ANDROID_HOME/build-tools/34.0.0"
JAR="$ANDROID_HOME/platforms/android-34/android.jar"
rm -rf build && mkdir -p build/classes build/dex
"$BT/aapt2" compile --dir res -o build/res.zip
"$BT/aapt2" link -I "$JAR" --manifest AndroidManifest.xml -o build/unsigned.apk build/res.zip --java build/gen
javac --release 11 -classpath "$JAR" -d build/classes $(find src build/gen -name '*.java') 2>&1 | grep -v 'warning: \[options\]' || true
(cd build/classes && jar cf ../classes.jar .)
"$BT/d8" --release --min-api 26 --lib "$JAR" --output build/dex build/classes.jar
cp build/unsigned.apk build/app.apk
(cd build/dex && zip -q ../app.apk classes.dex)
"$BT/zipalign" -f 4 build/app.apk build/aligned.apk
[ -f debug.keystore ] || keytool -genkeypair -keystore debug.keystore -storepass android -keypass android \
  -alias scrollstopp -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ScrollStopp" >/dev/null
"$BT/apksigner" sign --ks debug.keystore --ks-pass pass:android --ks-key-alias scrollstopp --out ScrollStopp.apk build/aligned.apk
echo "Built $(pwd)/ScrollStopp.apk"
