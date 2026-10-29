import { Fragment } from "react";

// Text from the content with its line breaks ("\n") set as <br />, where a
// design breaks a title on purpose.
//
//   <LineBreaks text={"The People Behind\nEvery Matter."} />
export default function LineBreaks({ text }: { text: string }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}
