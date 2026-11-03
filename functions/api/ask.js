// 이 파일은 안 고쳐도 됩니다. 고칠 곳은 functions/_config.js 입니다.
//
// 하는 일: 사용자가 보낸 글 + _config.js 의 설정으로 프롬프트를 만들어
//          Workers AI 에 보내고, 「답」 또는 「되물음」 중 하나를 돌려줍니다.
//
// 저장하지 않습니다. 사용자가 보낸 글을 로그에 남기지 않습니다.
// 이 줄을 지우려면 AGENTS.md 의 금지 항목도 같이 고치세요.

import { 대상, 하는일, 기준, 멈춤, 모델 } from "../_config.js";

const 지시문 = `당신은 아래 사람을 위해 일합니다.

[쓰는 사람]
${대상.trim()}

[해야 할 일]
${하는일.trim()}

[잘된 것의 기준]
${기준.map((c, i) => `${i + 1}. ${c}`).join("\n")}

[멈추는 지점]
${멈춤.trim()}

반드시 아래 JSON 하나만 출력합니다. 다른 말은 붙이지 않습니다.
답할 수 있으면:   {"상태":"답","내용":"<한국어 답변>"}
되물어야 하면:   {"상태":"물음","내용":"<되물을 질문 한 문장>"}

멈추는 지점에 해당하면 추측하지 말고 반드시 "물음" 으로 답합니다.`;

function JSON추출(text) {
  if (!text) return null;
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s === -1 || e === -1 || e <= s) return null;
  try {
    return JSON.parse(text.slice(s, e + 1));
  } catch {
    return null;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let 입력 = "";
  try {
    const body = await request.json();
    입력 = (body && typeof body.입력 === "string") ? body.입력.trim() : "";
  } catch {
    입력 = "";
  }

  // 모델을 부르기 전에 거르는 1차 멈춤. 한도도 아끼고, 멈춤이 눈에 보입니다.
  if (입력.length < 5) {
    return Response.json({ 상태: "물음", 내용: "무엇을 도와드릴지 한 줄만 적어 주세요." });
  }

  try {
    const 결과 = await env.AI.run(모델, {
      messages: [
        { role: "system", content: 지시문 },
        { role: "user", content: 입력 },
      ],
      max_tokens: 700,
    });

    const 글 = (결과 && (결과.response ?? 결과.result ?? "")) + "";
    const 파싱 = JSON추출(글);

    if (파싱 && (파싱.상태 === "답" || 파싱.상태 === "물음") && 파싱.내용) {
      return Response.json({ 상태: 파싱.상태, 내용: String(파싱.내용) });
    }
    // JSON 으로 안 왔으면 그냥 답으로 취급합니다.
    return Response.json({ 상태: "답", 내용: 글.trim() || "답을 만들지 못했습니다." });
  } catch (err) {
    // 하루 무료 한도(10,000 뉴런)를 넘기면 여기로 옵니다.
    return Response.json(
      { 상태: "오류", 내용: "지금은 답할 수 없습니다. 하루 사용 한도를 넘었거나 모델 이름이 틀렸을 수 있습니다." },
      { status: 503 },
    );
  }
}
