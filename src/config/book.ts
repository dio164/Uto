export interface BookConfig {
  title: string;
  subtitle: string;
  author: string;
  year: string;
  landingInstruction: string;
  dedication: {
    heading: string;
    text: string;
    signature?: string;
  };
  closing: {
    heading: string;
    text: string;
    subtext?: string;
  };
}

export const BOOK_CONFIG: BookConfig = {
  title: "Tales from Planet Uto",
  subtitle: "Tales from the best planet i've ever lived on",
  author: "psállō",
  year: "MCMXXIV",
  landingInstruction: "Come read with me.",
  dedication: {
    heading: "Dedication",
    text: "To the Creator,\nwhose hands shaped every star I wandered beneath,\nand every home I never knew I was searching for.\nI thought I knew what home was,\nuntil You showed me one\nmore beautiful than I could have ever imagined.",
    signature: ""
  },
  closing: {
    heading: "Finis",
    text: "The words end here,\nbut the silence\nstill remembers.",
    subtext: "Thank you for listening to my quietest hours."
  }
};
