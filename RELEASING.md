# Шинэ хувилбар гаргах заавар (Packagist Release)

Энэхүү багц нь Packagist дээр байршдаг тул шинэ хувилбар гаргахдаа **Git Tag** ашиглана.

## Алхам 1: Өөрчлөлтүүдээ хадгалах

Бүх өөрчлөлтөө commit хийж, үндсэн branch (main/master) руу push хийсэн байх шаардлагатай.

```bash
git add .
git commit -m "Update: Added custom column support"
git push origin main
```

## Алхам 2: Хувилбар (Tag) үүсгэх

Semantic Versioning (vX.Y.Z) дүрмийн дагуу шинэ tag үүсгэнэ.
Жш: Одоогийн хувилбар `v1.0.0` бол дараагийнх нь `v1.0.1` (bug fix) эсвэл `v1.1.0` (feature) байна.

```bash
# Tag үүсгэх
git tag v1.1.0

# Tag-аа push хийх (Энэ нь Packagist руу шинэ хувилбар гарсаныг мэдэгдэнэ)
git push origin v1.1.0
```

## Алхам 3: Packagist дээр шалгах

Packagist нь GitHub/GitLab-тай холбогдсон тохиолдолд автоматаар шинэчлэгдэнэ.
Хэрэв автоматаар шинэчлэгдэхгүй бол:

1. [Packagist.org](https://packagist.org/) руу орж нэвтэрнэ.
2. Багцаа хайж олно (`amaraa019/laravel-universal-crud`).
3. **"Update"** товчийг дарж гараар шинэчлэнэ.

---

## Хувилбар устгах (Алдаа гарсан үед)

Хэрэв буруу tag үүсгэсэн бол дараах командаар устгана:

```bash
# Local tag устгах
git tag -d v1.1.0

# Remote (server) tag устгах
git push origin :refs/tags/v1.1.0
```
