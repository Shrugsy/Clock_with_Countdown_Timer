build-windows:
	npm run pack

build-linux:
	npm run pack --linux AppImage

build-mac:
	npm run pack --mac