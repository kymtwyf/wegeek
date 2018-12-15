package:
	mkdir -p ../archives
	zip ../archives/mongodb.zip * -r

depends:
	pip install pymongo -t ./

upload:
	coscmd upload ../archives/mongodb.zip mongodb.zip
