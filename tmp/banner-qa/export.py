from PIL import Image,ImageCms,ImageOps
from pathlib import Path
import sys
source,base,w,h=sys.argv[1:];w,h=int(w),int(h)
im=Image.open(source).convert('RGB');im=ImageOps.fit(im,(w,h),method=Image.Resampling.LANCZOS)
p=Path('tmp/banner-qa')/base
icc=ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
im.save(str(p)+'.png',icc_profile=icc)
im.save(str(p)+'.webp',quality=94,method=6,icc_profile=icc)
im.save(str(p)+'.jpg',quality=94,subsampling=0,optimize=True,icc_profile=icc)
if 'desktop' in base: ImageOps.fit(im,(1440,540),method=Image.Resampling.LANCZOS).save(str(p)+'-display.png')
elif 'mobile' in base: ImageOps.fit(im,(390,430),method=Image.Resampling.LANCZOS,centering=(.5,0)).save(str(p)+'-display.png')
else: im.resize((640,480),Image.Resampling.LANCZOS).save(str(p)+'-display.png')
for ext in ['png','webp','jpg']: print(str(p)+'.'+ext,Path(str(p)+'.'+ext).stat().st_size)
