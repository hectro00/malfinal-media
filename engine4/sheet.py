import sys,glob
from PIL import Image
d=sys.argv[1];cols=int(sys.argv[2]) if len(sys.argv)>2 else 14
fs=sorted(glob.glob(d+'/*.jpg'));w,h=180,320;rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(w*cols,h*rows))
for i,f in enumerate(fs): S.paste(Image.open(f).resize((w,h)),((i%cols)*w,(i//cols)*h))
S.save(d+'_sheet.jpg',quality=85);print(len(fs))
