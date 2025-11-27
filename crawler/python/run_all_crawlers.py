"""
批量运行所有人物爬虫脚本
成都理工大学历史人物照片爬虫
"""
import subprocess
import os
import time

# 爬虫文件列表
crawler_files = [
    ("crawl_xuqiang_images.py", "许强"),
    ("crawl_liuqingyou_images.py", "刘清友"),
    ("crawl_hubing_images.py", "胡兵"),
    ("crawl_tangqingli_images.py", "唐清利"),
    ("crawl_liubaojun_images.py", "刘宝珺"),
    ("crawl_houmingcai_images.py", "侯明才"),
    ("crawl_junengpan_images.py", "巨能攀"),
    ("crawl_zhouzhongli_images.py", "周仲礼"),
    ("crawl_zengguoqiang_images.py", "曾国强"),
    ("crawl_guoqiang_images.py", "郭强"),
]

def run_crawler(file_name, person_name):
    """
    运行单个爬虫脚本
    """
    print("\n" + "="*70)
    print(f"开始爬取: {person_name}")
    print("="*70)
    
    try:
        result = subprocess.run(
            ["python", file_name],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True,
            encoding='gbk',
            errors='ignore'
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print("错误信息:", result.stderr)
        
        print(f"\n{person_name} 爬取完成")
        
    except Exception as e:
        print(f"运行 {file_name} 时出错: {str(e)}")
    
    # 间隔时间，避免请求过快
    time.sleep(2)

def main():
    """
    主函数
    """
    print("="*70)
    print("成都理工大学历史人物照片批量爬虫")
    print("="*70)
    print(f"\n将依次爬取 {len(crawler_files)} 位人物的照片\n")
    
    # 显示爬取列表
    print("爬取人物列表:")
    for idx, (_, name) in enumerate(crawler_files, 1):
        print(f"  {idx}. {name}")
    
    print("\n" + "="*70)
    input("按回车键开始爬取...")
    
    start_time = time.time()
    
    # 依次运行每个爬虫
    for file_name, person_name in crawler_files:
        run_crawler(file_name, person_name)
    
    end_time = time.time()
    total_time = end_time - start_time
    
    print("\n" + "="*70)
    print("所有爬虫运行完成！")
    print(f"总耗时: {total_time:.2f} 秒 ({total_time/60:.2f} 分钟)")
    print("\n所有图片已保存到 images 文件夹，按人物拼音分类")
    print("="*70)

if __name__ == "__main__":
    main()
