import { useLoaderData, Link } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import { HiArrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import {
  getLetterFromSlug,
  processLetterAsHtml,
  Letter,
} from "~/lib/newsletter";
import { formatDate } from "~/lib/date";

export const loader: LoaderFunction = async ({ params }) => {
  const letter = await getLetterFromSlug(params.slug as string);

  if (!letter) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return processLetterAsHtml(letter);
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data?.subject,
  };
};

export default function Letter() {
  const letter = useLoaderData<Letter>();
  return (
    <Page>
      <LetterLink to="/letters" whileHover="hover">
        <motion.span variants={{ hover: { x: -5 } }}>
          <HiArrowLeft />
        </motion.span>{" "}
        Letters
      </LetterLink>
      <DateWrapper>{formatDate(new Date(letter.publish_date))}</DateWrapper>
      <Title>{letter.subject}</Title>
      <Article dangerouslySetInnerHTML={{ __html: letter.body }} />
    </Page>
  );
}

const DateWrapper = styled("p", {
  color: "$grey600",
  marginTop: "$16",
  marginBottom: "$4",
});

const LetterLink = styled(motion(Link), {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",

  "&:hover": {
    color: "$blue",
  },

  span: {
    marginRight: "$2",
  },
});

const Page = styled("div", {
  fontFamily: "$sans",
  padding: "$24 $8",
  maxWidth: "calc(40rem + $space$16)",
  margin: "0 auto",
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "3rem",
  lineHeight: 1,
  fontWeight: 600,
  marginBottom: "$16",
});

const Article = styled("article", {
  ol: {
    counterReset: "list",
  },

  li: {
    counterIncrement: "list",
    paddingLeft: "$8",
    position: "relative",

    "&:before": {
      content: `counters(list, '.') ". "`,
      position: "absolute",
      left: 0,
      fontFamily: "$mono",
      fontSize: "$sm",
      top: 2,
      color: "$grey600",
    },
  },

  a: {
    color: "$blue",
    textDecoration: "underline",
  },

  code: {
    background: "$white",
    fontSize: "$sm",
    padding: "$1",
    borderRadius: 4,
  },

  "> h2": {
    fontSize: "$2xl",
    fontWeight: 600,
    fontFamily: "$serif",
    marginTop: "$10",
  },

  "> pre": {
    maxWidth: "calc(100% + $space$16)",
    overflowX: "scroll",
    background: "$white",
    padding: "$8",
    borderRadius: "8px",
    margin: "$10 -$8",
    marginBottom: "$10 !important",
    border: "2px solid $grey600",
  },

  "> p > img": {
    marginTop: "$10",
    marginBottom: "$10 !important",
    borderRadius: 8,
  },

  "> hr": {
    marginTop: "$10",
    marginBottom: "$10 !important",
    borderTop: "2px solid $grey200",
  },

  "> :not(:last-child)": {
    marginBottom: "$4",
  },
});
