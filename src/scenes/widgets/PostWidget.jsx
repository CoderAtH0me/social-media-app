import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  // ADD BUTTON AND INPUTBASE
  Button,
  InputBase,
} from "@mui/material";

import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
// ADDING USERIMAGE TO USE IT INTO COMMENT SECTION
import UserImage from "../../components/UserImage";
// IMPORTING HASH FUNCTION
import { sha1 } from "crypto-hash";
// IMPORTING COMMENTATOR WIDGET
import Commentator from "../../components/Commentator";
/*-----------------------------*/

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  // ADDING HOOK FOT SET COMMENT
  const [comment, setComment] = useState("");
  const [isComments, setIsComments] = useState(false);
  /*------------------------------------------------ */

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  // ADD USER OBJECT FOR USER ALL USER INFORMATION
  const loggedInUser = useSelector((state) => state.user);
  const loggedInUserId = loggedInUser._id;

  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  // ADD COMMENT COUNT AND VALUES ARRAY
  const commentCount = Object.keys(comments).length;
  const returnedComments = Object.values(comments);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  // ADIING PATCH COMMENT FUNCTION
  const patchComment = async () => {
    // HASHING COMMENT FOR CREAE UNIQ commentId
    const commentHash = await sha1(comment);
    const commentId = loggedInUserId + "_" + commentHash;
    // CREATING USER INFO FOR EVERY COMMENT

    const commentData = {
      postId: postId,
      commentId: commentId,
      name: loggedInUser.firstName,
      commentBody: comment,
      userPicturePath: loggedInUser.picturePath,
    };

    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId, comment: commentData }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsComments(true);
    setComment("");
  };

  /*------------------------------------------------------- */

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* MODIFYING UI PART */}
      {isComments && (
        <Box mt="0.5rem">
          {returnedComments.map((commentData, i) => (
            <Commentator
              key={`${commentData.name}-${i}`}
              postId={commentData.postId}
              commentId={commentData.commentId}
              name={commentData.name}
              commentBody={commentData.commentBody}
              userPicturePath={commentData.userPicturePath}
              setIsComments={setIsComments}
            />
          ))}
          <Divider />
          <Divider />
          <Box m="1rem auto 0.5rem">
            <FlexBetween gap="1rem">
              <UserImage image={loggedInUser.picturePath} />
              <InputBase
                placeholder="Comment here..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "1rem",
                  padding: "0.5rem 1rem",
                }}
              />

              {/* ADDING BUTTON */}
              <Button
                disabled={!comment}
                onClick={patchComment}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                }}
              >
                APPLY
              </Button>
            </FlexBetween>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};
export default PostWidget;
