import { useRef, useCallback, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { Form } from "react-bootstrap";

const RatingFilter = ({ allFilters, setAllFilters }) => {
  const ratingRefs = useRef([]);

  const clearRatings = useCallback(() => {
    ratingRefs.current.forEach((_, idx) => {
      ratingRefs.current[idx].checked = false;
    });
  }, []);

  useEffect(() => {
    if (Object.entries(allFilters.rating).length === 0) {
      clearRatings();
    }
  }, [allFilters.rating, clearRatings]);

  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Form.Check key={idx} type="checkbox" id={`check-rating-${idx}`}>
          <Form.Check.Input
            type="checkbox"
            isValid
            ref={(rating) => (ratingRefs.current[idx] = rating)}
            onChange={(e) =>
              setAllFilters({
                ...allFilters,
                rating: { ...allFilters.rating, [5 - idx]: e.target.checked },
              })
            }
          />
          <Form.Check.Label style={{ cursor: "pointer" }}>
            <Rating readonly size={20} initialValue={5 - idx} />
          </Form.Check.Label>
        </Form.Check>
      ))}
    </>
  );
};

export default RatingFilter;
