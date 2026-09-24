/** Numbered steps with a crimson top rule, on black. */
export function StepsGrid({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-9 p-0">
      {steps.map((step, i) => (
        <li key={step.title} className="border-t-2 border-crimson pt-[22px]">
          <span className="font-serif text-[1.3rem] text-crimson">0{i + 1}</span>
          <h3 className="m-0 mt-3 mb-2.5 font-serif text-[1.3rem] font-semibold">
            {step.title}
          </h3>
          <p className="m-0 text-[14.5px] text-white/68">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
