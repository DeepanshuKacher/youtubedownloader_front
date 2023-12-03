"use client";

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import axios, { AxiosError } from "axios";

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

// type VideoMetadata = {
//   mimeType: string;
//   qualityLabel: string;
//   bitrate: number;
//   audioBitrate: number;
//   itag: number;
//   width: number;
//   height: number;
//   lastModified: string;
//   quality: string;
//   fps: number;
//   projectionType: string;
//   audioQuality: string;
//   approxDurationMs: string;
//   audioSampleRate: string;
//   audioChannels: number;
//   url: string;
//   hasVideo: boolean;
//   hasAudio: boolean;
//   container: string;
//   codecs: string;
//   videoCodec: string;
//   audioCodec: string;
//   isLive: boolean;
//   isHLS: boolean;
//   isDashMPD: boolean;
// };

type VideoResponseMetaData = {
  qualities: {
    [key: string]: {
      data: {
        audioBitrate: 96;
        itag: 18;
        bitrate: 303648;
      };
    };
  };
  title: string;
};

// function filterAndSortUniqueQualityLabel(filteredData: VideoMetadata[]) {
//   // Custom sorting function
//   const resolutionOrder: { [key: string]: number } = {
//     "2160p": 1,
//     "1440p": 2,
//     "1080p": 3,
//     "720p": 4,
//     "480p": 5,
//     "360p": 6,
//     "240p": 7,
//     "144p": 8,
//   };
//   filteredData?.sort((a, b) => {
//     if (a.qualityLabel === null && b.qualityLabel === null) {
//       return 0;
//     } else if (a.qualityLabel === null) {
//       return 1;
//     } else if (b.qualityLabel === null) {
//       return -1;
//     } else {
//       const aRes: any = resolutionOrder[a.qualityLabel];
//       const bRes: any = resolutionOrder[b.qualityLabel];
//       if (aRes === bRes) {
//         return a.qualityLabel.localeCompare(b.qualityLabel);
//       }
//       return aRes - bRes;
//     }
//   });

//   return filteredData;
// }

const enviornment_prod =
  process.env.NEXT_PUBLIC_Enviornment === "production" ? true : false;

const enviornment_dev = !enviornment_prod;

const baseURL = enviornment_prod ? "" : "http://192.168.196.14:3000";
axios.defaults.baseURL = baseURL;

const handleError = (err: any) => {
  alert("Some error");
  if (enviornment_dev) console.log(err);
};

const Home: React.FC = () => {
  const [videoLink, setVideoLink] = useState<string>("");
  const [availableQualities, setAvailableQualities] = useState<
    VideoResponseMetaData["qualities"]
  >({});
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the main button
  // const [qualityLoading, setQualityLoading] = useState<boolean[]>([]); // Separate loading states for each quality button
  const [qualityLoading, setQualityLoading] = useState(false); // Separate loading states for each quality button
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [showModal, setModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");

  // const handleQualityDownload = async (quality: string, index: number) => {
  //   handlShowModal();

  //   // setQualityLoading((prev) => {
  //   //   const updatedLoading = [...prev];
  //   //   updatedLoading[index] = true;
  //   //   return updatedLoading;
  //   // });

  //   setQualityLoading(true);

  //   if (availableQualities?.[quality]?.["data"]?.["audioBitrate"] > 0) {
  //     setDownloadUrl(availableQualities?.[quality]?.["data"]?.["url"]);
  //   } else
  //     try {
  //       const response = await axios.post("download", {
  //         videoUrl: videoLink,
  //         itag: availableQualities?.[quality]?.["data"]?.["itag"],
  //         hasAudio:
  //           availableQualities?.[quality]?.["data"]?.["audioBitrate"] > 0
  //             ? true
  //             : false,
  //       });

  //       setDownloadUrl(window.URL.createObjectURL(new Blob([response.data])));

  //       if (enviornment_dev) console.log(response.data);
  //     } catch (error) {
  //       handleError(error);
  //     }

  //   // Replace this with your download completion logic
  //   // setQualityLoading((prev) => {
  //   //   const updatedLoading = [...prev];
  //   //   updatedLoading[index] = false;
  //   //   return updatedLoading;
  //   // });

  //   setQualityLoading(false);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulating a delay for fetching available qualities (replace with actual logic)
    try {
      const response = await axios.post("/", { videoUrl: videoLink });

      const availableQualities: VideoResponseMetaData = response?.data;
      if (enviornment_dev) console.log(availableQualities);
      // return;

      // const sortAvailableQualities =
      // filterAndSortUniqueQualityLabel(availableQualities);

      // console.log(sortAvailableQualities);

      // For demo purposes, simulating available qualities here
      setAvailableQualities(availableQualities.qualities);
      setVideoTitle(availableQualities.title);
      // setQualityLoading(new Array(qualities.length).fill(false)); // Initializing loading states for quality buttons
      setInputDisabled(true);
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handlShowModal = () => {
    setModal(true);
  };

  return (
    <>
      <Container>
        <Row className="mt-5">
          <Col md={{ span: 6, offset: 3 }}>
            <h2>YouTube Video Downloader</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formVideoLink">
                <Form.Label>Enter YouTube Video Link:</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Paste the YouTube video link here"
                  value={videoLink}
                  onChange={handleInputChange}
                  disabled={inputDisabled}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-2"
                    disabled={loading || !videoLink.trim()}
                  >
                    {loading ? (
                      <span>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Loading...
                      </span>
                    ) : (
                      "Get Available Qualities"
                    )}
                  </Button>
                </Col>
                <Col>
                  {videoTitle ? (
                    <Button
                      variant="primary"
                      onClick={() => window.location.reload()}
                      // type="submit"
                      className="mt-2"
                      // disabled={loading || !videoLink.trim()}
                    >
                      Download Another
                    </Button>
                  ) : null}
                </Col>
              </Row>
            </Form>
            {Object.keys(availableQualities).map((item, index) => {
              const videoMetadata = availableQualities[item];
              console.log(videoMetadata.data.itag);
              return (
                <ListGroup.Item
                  key={index}
                  className="d-flex bg-primary-subtle mt-2 rounded justify-content-around align-items-center py-2"
                >
                  <span>{item}</span>
                  <Button
                    variant="success"
                    className="ms-2"
                    as="a"
                    download="yourvideo.mp4"
                    href={`${baseURL}/video?url=${videoLink}&itag=${
                      videoMetadata.data.itag
                    }&title=${videoTitle}&audio=${
                      videoMetadata.data.audioBitrate > 0 ? true : false
                    }
                  `}
                    // href={`http://192.168.196.14:3000/${videoLink
                    //   .replace(/:/g, "%3")
                    //   .replace(/\//g, "%2")}/${
                    //   availableQualities[item]["data"]["itag"]
                    // }`}
                    // onClick={() => handleQualityDownload(item, index)}
                    // disabled={qualityLoading[index]}
                  >
                    {/*     {qualityLoading[index] ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                  ) : ( */}
                    Get It
                    {/* )} */}
                  </Button>
                </ListGroup.Item>
              );
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
