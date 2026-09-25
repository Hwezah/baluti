/** Numbered steps with a hairline top rule, on black. */
export function StepsGrid({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-9 p-0">
      {steps.map((step, i) => (
        <li key={step.title} className="border-t border-white/25 pt-[22px]">
          <span className="font-serif text-[1.3rem] text-white/45">0{i + 1}</span>
          <h3 className="m-0 mt-3 mb-2.5 font-serif text-[1.3rem] font-semibold">
            {step.title}
          </h3>
          <p className="m-0 text-[14.5px] text-white/68">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
