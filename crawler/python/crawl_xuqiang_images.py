import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse, unquote
import re

class XuQiangImageCrawler:
    def __init__(self, output_dir="xuqiang_images"):
        """
        初始化爬虫
        :param output_dir: 图片保存目录
        """
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
    
    def crawl_bing_images(self, keyword="成都理工大学 许强", max_images=50):
        """
        从Bing图片搜索爬取
        :param keyword: 搜索关键词
        :param max_images: 最大图片数量
        """
        print(f"\n[1] 开始从Bing图片搜索: {keyword}")
        
        try:
            # Bing图片搜索URL
            search_url = f"https://www.bing.com/images/search?q={keyword}&first=1"
            response = self.session.get(search_url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                # 使用多种正则模式提取图片URL
                patterns = [
                    r'"murl":"(https?://[^"]+)"',
                    r'"turl":"(https?://[^"]+)"',
                    r'mediaurl=([^&"]+)',
                ]
                
                img_urls = []
                for pattern in patterns:
                    urls = re.findall(pattern, response.text)
                    img_urls.extend(urls)
                
                # 去重
                img_urls = list(set(img_urls))
                print(f"找到 {len(img_urls)} 张图片链接")
                
                downloaded = 0
                for idx, img_url in enumerate(img_urls[:max_images], 1):
                    # URL解码处理
                    img_url = unquote(img_url)  # 完整URL解码
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
    
    def crawl_baidu_images(self, keyword="成都理工大学 许强", max_images=50):
        """
        从百度图片搜索爬取
        :param keyword: 搜索关键词
        :param max_images: 最大图片数量
        """
        print(f"\n[2] 开始从百度图片搜索: {keyword}")
        
        try:
            # 使用百度图片API接口
            search_url = f"https://image.baidu.com/search/acjson?tn=resultjson_com&word={keyword}&pn=0&rn={max_images}"
            response = self.session.get(search_url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                # 尝试多种正则模式
                patterns = [
                    r'"objURL":"(.*?)"',
                    r'"middleURL":"(.*?)"',
                    r'"thumbURL":"(.*?)"',
                ]
                
                img_urls = []
                for pattern in patterns:
                    urls = re.findall(pattern, response.text)
                    img_urls.extend(urls)
                
                # 去重
                img_urls = list(set(img_urls))
                print(f"找到 {len(img_urls)} 张图片链接")
                
                downloaded = 0
                for idx, img_url in enumerate(img_urls[:max_images], 1):
                    # URL解码
                    img_url = unquote(img_url)  # 完整URL解码
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
    
    def crawl_cdut_website(self):
        """
        从成都理工大学官网爬取许强相关图片
        """
        print("\n[3] 开始从成都理工大学官网搜索")
        
        # 成都理工大学相关页面
        urls = [
            "https://www.cdut.edu.cn",
            "https://www.cdut.edu.cn/jgsz/dxldyx/xrld.htm",
            "https://www.cdut.edu.cn/jgsz.htm"
        ]
        
        for base_url in urls:
            try:
                print(f"正在访问: {base_url}")
                response = self.session.get(base_url, headers=self.headers, timeout=10)
                if response.status_code == 200:
                    response.encoding = 'utf-8'
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 查找所有图片标签
                    images = soup.find_all('img')
                    
                    for idx, img in enumerate(images, 1):
                        img_url = img.get('src') or img.get('data-src')
                        if img_url:
                            # 处理相对URL
                            img_url = urljoin(base_url, img_url)
                            
                            # 检查是否与许强相关
                            alt_text = img.get('alt', '').lower()
                            if '许强' in alt_text or 'xuqiang' in img_url.lower():
                                ext = self.get_image_extension(img_url)
                                filename = f"cdut_{idx:03d}{ext}"
                                print(f"找到相关图片: {alt_text}")
                                self.download_image(img_url, filename)
                                time.sleep(0.3)
                
                time.sleep(1)
            except Exception as e:
                print(f"访问 {base_url} 失败: {str(e)}")
    
    def crawl_google_images(self, keyword="成都理工大学 许强", max_images=30):
        """
        从Google图片搜索爬取
        :param keyword: 搜索关键词
        :param max_images: 最大图片数量
        """
        print(f"\n[4] 开始从Google图片搜索: {keyword}")
        
        try:
            search_url = f"https://www.google.com/search?q={keyword}&tbm=isch"
            response = self.session.get(search_url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                # Google图片搜索结果中提取图片URL
                img_urls = re.findall(r'"(https?://[^"]+\.(?:jpg|jpeg|png|gif|webp))"', response.text)
                
                # 去重
                img_urls = list(set(img_urls))
                print(f"找到 {len(img_urls)} 张图片链接")
                
                downloaded = 0
                for idx, img_url in enumerate(img_urls[:max_images], 1):
                    ext = self.get_image_extension(img_url)
                    filename = f"google_{idx:03d}{ext}"
                    
                    print(f"[{idx}/{min(len(img_urls), max_images)}] 下载: {img_url[:80]}...")
                    if self.download_image(img_url, filename):
                        downloaded += 1
                    time.sleep(0.5)
                
                print(f"Google搜索完成，成功下载 {downloaded} 张图片")
        except Exception as e:
            print(f"Google图片爬取失败: {str(e)}")
    
    def crawl_scholar_websites(self):
        """
        从学术网站爬取（如ResearchGate、Google Scholar等）
        """
        print("\n[5] 开始从学术网站搜索")
        
        # 可以添加更多学术网站的爬取逻辑
        scholar_urls = [
            "https://www.researchgate.net/search?q=Xu%20Qiang%20CDUT",
        ]
        
        for url in scholar_urls:
            try:
                print(f"正在访问: {url}")
                response = self.session.get(url, headers=self.headers, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    images = soup.find_all('img')
                    
                    for idx, img in enumerate(images, 1):
                        img_url = img.get('src')
                        if img_url and img_url.startswith('http'):
                            ext = self.get_image_extension(img_url)
                            filename = f"scholar_{idx:03d}{ext}"
                            self.download_image(img_url, filename)
                            time.sleep(0.5)
                
                time.sleep(1)
            except Exception as e:
                print(f"学术网站爬取失败: {str(e)}")
    
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
        return '.jpg'  # 默认使用jpg
    
    def run(self):
        """
        运行爬虫
        """
        print("="*60)
        print("成都理工大学 - 许强 照片爬虫")
        print("="*60)
        
        # 1. 从Bing图片爬取
        self.crawl_bing_images(keyword="成都理工大学 许强", max_images=30)
        
        # 2. 从百度图片爬取
        self.crawl_baidu_images(keyword="成都理工大学 许强", max_images=30)
        
        # 3. 从成都理工大学官网爬取
        self.crawl_cdut_website()
        
        # 4. 从Google图片爬取（可选，可能需要处理验证码）
        # self.crawl_google_images(keyword="成都理工大学 许强", max_images=30)
        
        # 5. 从学术网站爬取（可选）
        # self.crawl_scholar_websites()
        
        print("\n" + "="*60)
        print(f"爬取完成！共下载 {self.downloaded_count} 张图片")
        print(f"保存位置: {os.path.abspath(self.output_dir)}")
        print("="*60)


if __name__ == "__main__":
    # 创建爬虫实例
    crawler = XuQiangImageCrawler(output_dir="../images/xuqiang")
    
    # 运行爬虫
    crawler.run()
