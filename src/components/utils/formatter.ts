const formatter = new Intl.NumberFormat("sv-se", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
});

export const formatStarRating = formatter.format;
