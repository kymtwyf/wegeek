package:
	mkdir -p ../archives
	zip ../archives/batch.zip * -r

depends:
	pip install pymongo -t ./

upload:
	coscmd upload ../archives/batch.zip batch.zip
