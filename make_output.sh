INPUT_DIR=./adv-build
OUTPUT_DIR=./output

mkdir -p $OUTPUT_DIR

for fhtml in $(find $INPUT_DIR -type f -name '*.html'); do
    bn=$(basename $fhtml)
    dn=$(dirname $fhtml)
    if [ -n "$(echo $bn|egrep -v '^index-')" ];then
        name=${bn%%.html}
        appname=$(echo $name |cut -d'-' -f1)
        outdir="$OUTPUT_DIR/$appname"
        mkdir -p $outdir
        cp $fhtml $outdir/
        cp -r $INPUT_DIR/images $outdir/
        cp $INPUT_DIR/stylesheet.css $outdir/
        fjs=$(egrep -o '<script src="[^"]+"></script>' $outdir/$bn|cut -d'"' -f2|sed -r 's/\n/ /g')
        for js in $(echo $fjs); do 
            bn2=$(basename $js)
            found="$(find $INPUT_DIR/ -type f -name ${bn2})"
            if [ -n "$found" ];then
                sed -i -r "s@${js}@${bn2}@g" $outdir/$bn
                find $INPUT_DIR/ -type f -name ${bn2} -exec cp {} $outdir/${bn2} \;
            else
                match=$(echo ${js}|sed -r 's@/@\\/@g')
                sed -i -r "/${match}/d" $outdir/$bn
                echo Skipped ${js} from $fhtml
            fi 
        done;
    fi
done;
