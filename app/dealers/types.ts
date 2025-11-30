export type Dealer = {
  id: string;
  name: string;
  location: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  focus: string;
  socials: Array<{ type: string; url: string }>;
};
