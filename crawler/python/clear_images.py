"""
清空所有爬取的图片文件夹
成都理工大学历史人物照片爬虫 - 清理脚本
"""
import os
import shutil

# 所有人物的文件夹名称
person_folders = [
    "xuqiang",
    "liuqingyou",
    "hubing",
    "tangqingli",
    "liubaojun",
    "houmingcai",
    "junengpan",
    "zhouzhongli",
    "zengguoqiang",
    "guoqiang"
]

def clear_folder(folder_path):
    """
    清空指定文件夹中的所有内容
    :param folder_path: 文件夹路径
    """
    if os.path.exists(folder_path):
        try:
            # 删除文件夹中的所有文件
            file_count = 0
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    file_count += 1
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            
            print(f"[OK] 已清空: {folder_path} (删除 {file_count} 个文件)")
            return file_count
        except Exception as e:
            print(f"[FAIL] 清空失败 {folder_path}: {str(e)}")
            return 0
    else:
        print(f"[-] 文件夹不存在: {folder_path}")
        return 0

def clear_all_images():
    """
    清空所有人物的图片文件夹
    """
    print("="*70)
    print("成都理工大学历史人物照片 - 清空脚本")
    print("="*70)
    
    # 获取images目录路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, "..", "images")
    
    print(f"\n图片目录: {os.path.abspath(images_dir)}")
    print("\n准备清空以下文件夹:")
    for folder in person_folders:
        print(f"  - {folder}")
    
    print("\n" + "="*70)
    confirm = input("确认要清空所有图片文件夹吗？(输入 yes 确认): ")
    
    if confirm.lower() != 'yes':
        print("\n已取消操作")
        return
    
    print("\n开始清空文件夹...")
    print("-"*70)
    
    total_files = 0
    for folder_name in person_folders:
        folder_path = os.path.join(images_dir, folder_name)
        total_files += clear_folder(folder_path)
    
    print("-"*70)
    print(f"\n清空完成！共删除 {total_files} 个文件")
    print("="*70)

def delete_all_folders():
    """
    删除整个images目录
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, "..", "images")
    
    if os.path.exists(images_dir):
        try:
            shutil.rmtree(images_dir)
            print(f"[OK] 已删除整个images目录: {os.path.abspath(images_dir)}")
        except Exception as e:
            print(f"[FAIL] 删除失败: {str(e)}")
    else:
        print("[-] images目录不存在")

if __name__ == "__main__":
    import sys
    
    # 检查命令行参数
    if len(sys.argv) > 1 and sys.argv[1] == "--delete-all":
        print("="*70)
        print("警告：将删除整个images目录！")
        print("="*70)
        confirm = input("确认删除整个images目录吗？(输入 DELETE 确认): ")
        if confirm == "DELETE":
            delete_all_folders()
        else:
            print("已取消操作")
    else:
        # 默认只清空文件夹内容
        clear_all_images()
