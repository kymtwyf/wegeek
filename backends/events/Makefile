package:
	mkdir -p ../archives
	zip ../archives/events.zip * -r

depends:
	pip install pymongo -t ./

upload:
	coscmd upload ../archives/events.zip events.zip
