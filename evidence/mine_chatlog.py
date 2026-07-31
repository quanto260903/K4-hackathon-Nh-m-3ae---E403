"""
Mining script for spec.md Section 1-2 evidence.
Source: data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv
Run from repo root: python evidence/mine_chatlog.py
Requires only the Python standard library.
"""
import csv
import re
from collections import Counter

PATH = "data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv"
csv.field_size_limit(10_000_000)


def actual_question(content):
    """Isolate the student's typed instruction from the quoted slide excerpt.
    Message format: (Trang N, doan duoc chon: "EXCERPT")\\nACTUAL_QUESTION
    Matching on raw content double-counts keywords that appear inside EXCERPT.
    """
    content = content.strip()
    if content.startswith("(Trang"):
        idx = content.find('")\n')
        if idx != -1:
            return content[idx + 3:].strip()
    return content


CANDIDATES = {
    "core_tomtat_khainiem": r"t[óo]m\s*t[ắa]t|recap|[ôo]n\s*(l[ạa]i|t[ậa]p)|kh[áa]i\s*ni[ệe]m|thu[ậa]t\s*ng[ữu]|\bl[àa]\s*g[ìi]\b|qu[êe]n\s*(c[áa]c|nh[ữu]ng)?\s*c[âa]u",
    "giai_thich_doan_boi_den": r"gi[ảa]i\s*th[íi]ch\s*(đo[ạa]n|ph[ầa]n)",
    "quiz": r"quiz|c[âa]u\s*h[ỏo]i\s*[ôo]n",
    "vi_du": r"v[íi]\s*d[ụu]",
    "bai_tap": r"b[àa]i\s*t[ậa]p|exercise",
    "dich": r"d[ịi]ch\b|translate",
}


def main():
    with open(PATH, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    students = [r for r in rows if r["role"] == "student"]
    print(f"student messages: {len(students)}")

    for label, pattern in CANDIDATES.items():
        rx = re.compile(pattern)
        matched = [r for r in students if rx.search(actual_question(r["content"] or "").lower())]
        convs = len({r["conversation_id"] for r in matched})
        users = len({r["user_id"] for r in matched})
        pct = len(matched) / len(students) * 100
        print(f"{label}: {len(matched)}/{len(students)} ({pct:.1f}%) | conv={convs} | users={users}")

        if label == "core_tomtat_khainiem":
            repeat = Counter(r["user_id"] for r in matched)
            n_repeat = sum(1 for c in repeat.values() if c >= 2)
            print(f"  -> users with >=2 matches: {n_repeat}, max single-user matches: {max(repeat.values())}")


if __name__ == "__main__":
    main()
