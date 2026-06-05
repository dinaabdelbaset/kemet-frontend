import shutil

src1 = r"C:\Users\Technologist\.gemini\antigravity-ide\brain\86bfc323-5c0a-49fc-a1d7-302318cb9519\dahab_360_1780271608524.png"
dest1 = r"e:\اخر تحديث\kemet-frontend-main\public\dahab_360.png"

src2 = r"C:\Users\Technologist\.gemini\antigravity-ide\brain\86bfc323-5c0a-49fc-a1d7-302318cb9519\pyramids_360_1780271627934.png"
dest2 = r"e:\اخر تحديث\kemet-frontend-main\public\pyramids_360.png"

try:
    shutil.copy(src1, dest1)
    print("Copied Dahab")
except Exception as e:
    print("Error Dahab:", e)

try:
    shutil.copy(src2, dest2)
    print("Copied Pyramids")
except Exception as e:
    print("Error Pyramids:", e)
