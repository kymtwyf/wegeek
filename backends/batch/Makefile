package:
	mkdir -p ../archives
	zip ../archives/batch.zip * -r

depends:
	pip install pymongo -t ./
	pip install jieba -t ./
	pip install gensim -t ./
	#pip install sklearn -t ./

upload:
	coscmd upload ../archives/batch.zip batch.zip
