import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse, unquote
import re

class CDUTImageCrawler:
    def __init__(self, person_name, output_dir):
        """
        初始化爬虫
        :param person_name: 人物姓名
        :param output_dir: 图片保存目录
        """
        self.person_name = person_name
        self.output_dir = output_dir
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.downloaded_count = 0
        
        # 创建保存目录
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def download_image(self, img_url, filename):
        """
        下载单张图片
        :param img_url: 图片URL
        :param filename: 保存的文件名
        """
        try:
            response = self.session.get(img_url, headers=self.headers, timeout=10, allow_redirects=True)
            if response.status_code == 200:
                # 检查内容类型是否为图片
                content_type = response.headers.get('content-type', '').lower()
                if 'image' in content_type or len(response.content) > 1000:
                    filepath = os.path.join(self.output_dir, filename)
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    print(f"[OK] 下载成功: {filename} ({len(response.content)} bytes)")
                    self.downloaded_count += 1
                    return True
                else:
                    print(f"[SKIP] 非图片内容: {filename}")
        except Exception as e:
            error_msg = str(e)
            if len(error_msg) > 100:
                error_msg = error_msg[:100] + "..."
            print(f"[FAIL] 下载失败: {error_msg}")
        return False
    
    def crawl_bing_images(self, keyword, max_images=30):
        """
        从Bing图片搜索爬取
        :param keyword: 搜索关键词
        :param max_images: 最大图片数量
        """
        print(f"\n[1] 开始从Bing图片搜索: {keyword}")
        
        try:
            search_url = f"https://www.bing.com/images/search?q={keyword}&first=1"
            response = self.session.get(search_url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                patterns = [
                    r'"murl":"(https?://[^"]+)"',
                    r'"turl":"(https?://[^"]+)"',
                    r'mediaurl=([^&"]+)',
                ]
                
                img_urls = []
                for pattern in patterns:
                    urls = re.findall(pattern, response.text)
                    img_urls.extend(urls)
                
                img_urls = list(set(img_urls))
                print(f"找到 {len(img_urls)} 张图片链接")
                
                downloaded = 0
                for idx, img_url in enumerate(img_urls[:max_images], 1):
                    img_url = unquote(img_url)
                    img_url = img_url.replace('\\/', '/')
                    
                    if img_url.startswith('http'):
                        ext = self.get_image_extension(img_url)
                        filename = f"bing_{idx:03d}{ext}"
                        
                        print(f"[{idx}/{min(len(img_urls), max_images)}] 下载: {img_url[:80]}...")
                        if self.download_image(img_url, filename):
                            downloaded += 1
                        time.sleep(0.5)
                
                print(f"Bing搜索完成，成功下载 {downloaded} 张图片")
        except Exception as e:
            print(f"Bing图片爬取失败: {str(e)}")
    
    def crawl_baidu_images(self, keyword, max_images=30):
        """
        从百度图片搜索爬取
        :param keyword: 搜索关键词
        :param max_images: 最大图片数量
        """
        print(f"\n[2] 开始从百度图片搜索: {keyword}")
        
        try:
            search_url = f"https://image.baidu.com/search/acjson?tn=resultjson_com&word={keyword}&pn=0&rn={max_images}"
            response = self.session.get(search_url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                patterns = [
                    r'"objURL":"(.*?)"',
                    r'"middleURL":"(.*?)"',
                    r'"thumbURL":"(.*?)"',
                ]
                
                img_urls = []
                for pattern in patterns:
                    urls = re.findall(pattern, response.text)
                    img_urls.extend(urls)
                
                img_urls = list(set(img_urls))
                print(f"找到 {len(img_urls)} 张图片链接")
                
                downloaded = 0
                for idx, img_url in enumerate(img_urls[:max_images], 1):
                    img_url = unquote(img_url)
                    img_url = img_url.replace('\\/', '/').replace('\\u0026', '&')
                    
                    if img_url.startswith('http'):
                        ext = self.get_image_extension(img_url)
                        filename = f"baidu_{idx:03d}{ext}"
                        
                        print(f"[{idx}/{min(len(img_urls), max_images)}] 下载: {img_url[:80]}...")
                        if self.download_image(img_url, filename):
                            downloaded += 1
                        time.sleep(0.5)
                
                print(f"百度搜索完成，成功下载 {downloaded} 张图片")
        except Exception as e:
            print(f"百度图片爬取失败: {str(e)}")
    
    def get_image_extension(self, url):
        """
        获取图片扩展名
        :param url: 图片URL
        :return: 扩展名（如.jpg）
        """
        parsed = urlparse(url)
        path = parsed.path.lower()
        
        for ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
            if ext in path:
                return ext
        return '.jpg'
    
    def run(self):
        """
        运行爬虫
        """
        print("="*60)
        print(f"成都理工大学 - {self.person_name} 照片爬虫")
        print("="*60)
        
        keyword = f"成都理工大学 {self.person_name}"
        
        self.crawl_bing_images(keyword=keyword, max_images=30)
        self.crawl_baidu_images(keyword=keyword, max_images=30)
        
        print("\n" + "="*60)
        print(f"爬取完成！共下载 {self.downloaded_count} 张图片")
        print(f"保存位置: {os.path.abspath(self.output_dir)}")
        print("="*60)


if __name__ == "__main__":
    crawler = CDUTImageCrawler(person_name="侯明才", output_dir="../images/houmingcai")
    crawler.run()
