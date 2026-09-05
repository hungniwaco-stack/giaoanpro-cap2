"use client";

import StampSeal from "./StampSeal";

interface Section {
  heading: string;
  body: string;
}

function parseMarkdown(markdown: string) {
  const lines = markdown.trim().split("\n");
  const titleLine = lines[0]?.startsWith("# ") ? lines.shift()!.replace(/^#\s*/, "") : "";
  const metaLine = lines[0]?.startsWith("**") ? lines.shift()! : "";
  const rest = lines.join("\n");
  const sections: Section[] = rest
    .split(/\n(?=## )/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [heading, ...body] = block.split("\n");
      return { heading: heading.replace(/^##\s*/, ""), body: body.join("\n").trim() };
    });
  return { titleLine, metaLine, sections };
}

// Năng lực chung theo CT GDPT 2018 / Công văn 5512 — mọi gạch đầu dòng không khớp
// nhóm nào bên dưới được coi là năng lực đặc thù môn học.
const NL_CHUNG: { label: string; re: RegExp }[] = [
  { label: "Tự chủ & tự học", re: /tự chủ|tự học/i },
  { label: "Giao tiếp & hợp tác", re: /giao tiếp|hợp tác|thảo luận|nhóm/i },
  { label: "GQVĐ & sáng tạo", re: /giải quyết vấn đề|sáng tạo/i },
];
function classifyNangLuc(text: string) {
  return NL_CHUNG.find((n) => n.re.test(text))?.label ?? "Đặc thù môn học";
}

function parseBullets(body: string) {
  return body
    .split("\n")
    .map((l) => l.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

// Gợi ý phân bổ thời gian cho 4 hoạt động chuẩn 5512 (Mở đầu / Hình thành /
// Luyện tập / Vận dụng) theo tỉ lệ phổ biến trong tập huấn GDPT 2018.
// ponytail: tỉ lệ cố định, không cá nhân hoá theo môn — đủ dùng làm gợi ý nhanh.
const TY_LE_HOAT_DONG = [0.15, 0.4, 0.3, 0.15];
function phanBoThoiGian(metaLine: string, soHoatDong: number) {
  const match = metaLine.match(/(\d+)\s*phút/);
  const tongPhut = match ? Number(match[1]) : 45;
  const tyLe = soHoatDong === 4 ? TY_LE_HOAT_DONG : Array(soHoatDong).fill(1 / soHoatDong);
  const phut = tyLe.map((t) => Math.round((t * tongPhut) / 5) * 5 || 5);
  const daPhanBo = phut.reduce((a, b) => a + b, 0);
  if (phut.length) phut[phut.length - 1] += tongPhut - daPhanBo;
  return { tongPhut, phut };
}

function ActivityCard({ heading, body, phut }: { heading: string; body: string; phut?: number }) {
  const fields = body
    .split("\n")
    .map((l) => l.match(/^-\s*\*\*(.+?):\*\*\s*(.*)$/))
    .filter((m): m is RegExpMatchArray => !!m);
  return (
    <div className="rounded-xl border border-ink/10 bg-paper px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium text-ink">{heading}</h4>
        {phut != null && (
          <span className="shrink-0 rounded-full bg-pine/10 px-2 py-0.5 text-xs font-semibold text-pine-dark">
            ~{phut} phút
          </span>
        )}
      </div>
      <dl className="mt-2 space-y-1.5 text-sm">
        {fields.map(([, label, value], i) => (
          <div key={i} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="shrink-0 font-medium text-ink-muted sm:font-normal">{label}:</dt>
            <dd className="min-w-0 flex-1 text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// A section body may itself be split into bold-labelled sub-groups, e.g.
// "**1. Kiến thức**\n- ...\n**2. Năng lực**\n- ...". Splitting on a line that
// is *only* "**Label**" handles that without needing a full markdown parser.
function splitSubGroups(body: string) {
  const blocks = body.split(/\n(?=\*\*.+\*\*\s*$)/m).map((b) => b.trim()).filter(Boolean);
  return blocks.map((b) => {
    const m = b.match(/^\*\*(.+?)\*\*\s*\n?([\s\S]*)$/);
    return m ? { label: m[1], content: m[2].trim() } : { label: null, content: b };
  });
}

function BulletList({ items, badge }: { items: string[]; badge?: boolean }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex flex-col gap-1 text-sm text-ink sm:flex-row sm:items-start sm:gap-2">
          {badge && (
            <span className="inline-block w-fit shrink-0 rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-pine-dark sm:mt-0.5">
              {classifyNangLuc(item)}
            </span>
          )}
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionBody({ heading, body, metaLine }: Section & { metaLine: string }) {
  if (/tiến trình dạy học/i.test(heading)) {
    const activities = body
      .split(/\n(?=### )/)
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => {
        const [h, ...rest] = b.split("\n");
        return { heading: h.replace(/^###\s*/, ""), body: rest.join("\n").trim() };
      });
    const { tongPhut, phut } = phanBoThoiGian(metaLine, activities.length);
    return (
      <div className="space-y-3">
        <div className="flex h-2 overflow-hidden rounded-full">
          {phut.map((p, i) => (
            <div
              key={i}
              className={i % 2 === 0 ? "bg-pine" : "bg-pine/50"}
              style={{ width: `${(p / tongPhut) * 100}%` }}
            />
          ))}
        </div>
        {activities.map((a, i) => (
          <ActivityCard key={i} heading={a.heading} body={a.body} phut={phut[i]} />
        ))}
      </div>
    );
  }

  const groups = splitSubGroups(body);
  return (
    <div className="space-y-3">
      {groups.map((g, i) => {
        const items = parseBullets(g.content);
        const isNangLuc = !!g.label && /năng lực/i.test(g.label);
        return (
          <div key={i}>
            {g.label && <p className="mb-1 text-sm font-semibold text-ink-muted">{g.label}</p>}
            {items.length ? (
              <BulletList items={items} badge={isNangLuc} />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-ink">{g.content}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ResultPanel({
  title,
  markdown,
  onDownloadDocx,
  onDownloadPptx,
}: {
  title: string;
  markdown: string;
  onDownloadDocx: () => void;
  onDownloadPptx: () => void;
}) {
  const { titleLine, metaLine, sections } = parseMarkdown(markdown);

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={onDownloadPptx}
            className="rounded-lg border border-ink/15 px-3 py-1.5 text-ink-muted hover:bg-sand"
          >
            Tải PPT
          </button>
          <button
            onClick={onDownloadDocx}
            className="rounded-lg bg-pine px-3 py-1.5 font-medium text-paper hover:bg-pine-dark"
          >
            Tải Word
          </button>
        </div>
      </div>

      <div className="flex items-start gap-4 px-5 py-5">
        <StampSeal />
        <div className="min-w-0 flex-1">
          {titleLine && <h3 className="font-display text-base font-semibold text-ink">{titleLine}</h3>}
          {metaLine && (
            <p
              className="mt-0.5 text-xs text-ink-muted"
              dangerouslySetInnerHTML={{ __html: metaLine.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
            />
          )}

          <div className="mt-4 max-h-[32rem] space-y-2 overflow-auto pr-1">
            {sections.map((s, i) => (
              <details key={i} open className="group rounded-xl border border-ink/10 bg-white/60 open:pb-3">
                <summary className="cursor-pointer select-none list-none px-4 py-2.5 font-medium text-ink marker:content-none">
                  <span className="mr-2 inline-block transition group-open:rotate-90">›</span>
                  {s.heading}
                </summary>
                <div className="px-4">
                  <SectionBody heading={s.heading} body={s.body} metaLine={metaLine} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
