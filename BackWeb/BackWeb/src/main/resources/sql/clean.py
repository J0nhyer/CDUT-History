# -*- coding: utf-8 -*-
import re

# 需要删除的人物（is_visible=0）
to_remove = [
    'liuyong', 'liuyun', 'luoqiang', 'nishijun', 'shizejin',
    'sunming', 'tangqingli', 'wanghai', 'wangjun', 'wangli',
    'wangming', 'xudachun', 'yixiangyi', 'zhanghua', 'zhangli',
    'zhangminghua', 'zhangshuichang', 'zhangwentao', 'zhaoyuan', 'zhouyong'
]

# 读取文件
with open('person_data_inserts.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除biography数据
for name in to_remove:
    pattern = r"  \('" + name + r"', '详细介绍'.*?\),\n"
    content = re.sub(pattern, '', content, flags=re.DOTALL)

# 删除relationship数据  
for name in to_remove:
    # 删除person_id匹配的行
    pattern1 = r"  \('" + name + r"',[^)]+\),\n"
    content = re.sub(pattern1, '', content)
    # 删除related_person_id匹配的行
    pattern2 = r"  \([^,]+, '" + name + r"',[^)]+\),\n"
    content = re.sub(pattern2, '', content)

# 删除event数据
for name in to_remove:
    pattern = r"-- " + name + r".*?\n.*?INSERT INTO `person_event`.*?;\n\n"
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    # 也删除单行的event
    pattern2 = r"INSERT INTO `person_event`[^;]*?'" + name + r"'[^;]*?;\n"
    content = re.sub(pattern2, '', content, flags=re.DOTALL)

# 写回文件
with open('person_data_inserts.sql', 'w', encoding='utf-8') as f:
    f.write(content)

print("删除完成！")
