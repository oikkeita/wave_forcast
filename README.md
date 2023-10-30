eas build -p android
bundletool-all-1.14.0.jar build-apks --bundle=application-af163141-8a55-486e-b9f9-873fd647f4f2.aab --output=app2.apks \
                       --ks=TestApp.jks \
                       --ks-pass=pass:123456 \
                       --ks-key-alias=key0 \
                       --key-pass=pass:123456

bundletool-all-1.14.0.jar install-apks --apks=app2.apks


bundletool-all-1.14.0.jar build-apks --bundle=application-af163141-8a55-486e-b9f9-873fd647f4f2.aab --output=app.apks
bundletool-all-1.14.0.jar install-apks --apks=app.apks
pause